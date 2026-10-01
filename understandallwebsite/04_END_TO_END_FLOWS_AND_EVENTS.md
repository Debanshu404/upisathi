# 04. End-to-End Flows & Database State Lifecycle

This document details how database records change across each phase of a swap transaction, along with the request payloads.

---

## 1. Database Entity Models

The MongoDB database relies on 4 primary collections to execute transactions:

```
┌──────────────────┐       1:N       ┌──────────────────┐
│       User       ├────────────────►│ ExchangeRequest  │
│  _id, username,  │                 │  creator (User)  │
│  trustScore,     │                 │  amount, type    │
│  location        │                 │  status, note    │
└────────┬─────────┘                 └────────┬─────────┘
         │                                    │
         │ 1:N                                │ 1:1
         ▼                                    ▼
┌──────────────────┐       1:N       ┌──────────────────┐
│      Review      │◄────────────────┤      Match       │
│  reviewer, user, │                 │  request,        │
│  rating, comment │                 │  requester,      │
└──────────────────┘                 │  accepter,       │
                                     │  status          │
                                     └────────┬─────────┘
                                              │
                                              │ 1:N
                                              ▼
                                     ┌──────────────────┐
                                     │       Chat       │
                                     │  matchId, sender,│
                                     │  message, time   │
                                     └──────────────────┘
```

---

## 2. Complete Transaction State Machine

An exchange goes through the following lifecycle states:

```
[ExchangeRequest: ACTIVE]
           │
           │ (Helper offers help)
           ▼
[Match: PENDING] ──(Requester declines)──► [Match: REJECTED] (Request returns to ACTIVE)
           │
           │ (Requester clicks "Accept & Chat")
           ▼
[Match: ACTIVE] & [ExchangeRequest: MATCHED]
           │
           ├──────────────────────────────┐
           │ (Either party cancels)       │ (Both meet & confirm)
           ▼                              ▼
[Match: CANCELLED]               [Match: COMPLETED] & [ExchangeRequest: COMPLETED]
                                          │
                                          ▼
                                 [Prompt Review & Rating]
```

---

## 3. Step-by-Step State Transitions

### Phase 1: Creating a Request
- **Endpoint**: `POST /api/v1/exchange/create`
- **Request Body**:
  ```json
  {
    "type": "NEED_CASH",
    "amount": 500,
    "expiry": 20,
    "note": "At Coffee Day near Metro Gate 2",
    "coordinates": {
      "latitude": 28.6139,
      "longitude": 77.2090
    }
  }
  ```
- **Database Action**:
  - Creates a new `ExchangeRequest` document with `status: 'ACTIVE'`, `expired: false`, and `expiresAt: Date.now() + 20 minutes`.
  - GeoJSON `location: { type: 'Point', coordinates: [77.2090, 28.6139] }`.
- **Socket Action**:
  - `io.to("public-room").emit("newRequest", { request: populatedDoc })`.

---

### Phase 2: Offering Help
- **Endpoint**: `POST /api/v1/match/accept/:requestId`
- **Caller**: The Helper (Accepter).
- **Database Action**:
  - Creates a new `Match` document:
    ```javascript
    {
      request: requestId,
      requester: request.creator,
      accepter: req.user.id,
      status: 'PENDING'
    }
    ```
- **Socket Action**:
  - `io.to("user:" + request.creator).emit("newMatch", { match })`.

---

### Phase 3: Requester Confirms the Offer
- **Endpoint**: `POST /api/v1/match/confirm/:matchId`
- **Caller**: The Requester.
- **Database Action**:
  - Updates `Match` document to `status: 'ACTIVE'`.
  - Updates parent `ExchangeRequest` to `status: 'MATCHED'`.
  - Automatically cancels other pending offers for this request.
- **Socket Action**:
  - `io.to("user:" + match.accepter).emit("confirmMatch", { match })`.
  - `io.to("public-room").emit("requestCancelled", { requestId })` (removes it from other nearby users' feeds).

---

### Phase 4: Live In-Person Exchange & Double Confirmation
- **Endpoint**: `POST /api/v1/match/complete/:matchId`
- **Database Logic**:
  ```javascript
  if (isRequester) {
    match.requesterCompleted = true;
  } else {
    match.accepterCompleted = true;
  }

  // Check if BOTH have confirmed
  if (match.requesterCompleted && match.accepterCompleted) {
    match.status = 'COMPLETED';
    request.status = 'COMPLETED';
    userA.exchangesCompleted += 1;
    userB.exchangesCompleted += 1;
  }
  await match.save();
  ```
- **Socket Action**:
  - If only one user clicked:
    `io.to("user:" + partnerId).emit("completeMatch", { match, waiting: true })`.
  - When both have clicked:
    `io.to("user:" + requesterId).emit("completeMatch", { match, isFullyCompleted: true })`.
    `io.to("user:" + accepterId).emit("completeMatch", { match, isFullyCompleted: true })`.

---

### Phase 5: Reviews & Reputation
- **Endpoint**: `POST /api/v1/reviews`
- **Request Body**:
  ```json
  {
    "matchId": "65fa...",
    "revieweeId": "65fb...",
    "rating": 5,
    "comment": "Super quick cash handover, very polite!"
  }
  ```
- **Database Action**:
  - Saves review and updates reviewee's `trustScore` = (average of all verified ratings).
