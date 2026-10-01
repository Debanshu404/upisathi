# 03. Socket.io Deep Dive — The Complete Real-Time Guide

> **Note for Full-Stack Developers:**  
> If you already know REST APIs, Node, Express, and React, but have never worked with **Socket.io**, this guide is written specifically for you. No unnecessary theory—just how Socket.io works and how it is implemented in this codebase.

---

## 1. Why Do We Need Socket.io? (HTTP vs WebSockets)

In traditional HTTP (REST APIs):
- The **client** always makes the request: *"Hey server, any new offers?"*
- The **server** responds and closes the connection.
- The server **cannot** reach out to the client uninvited.

### The Problem in a P2P App:
Imagine User A is waiting for someone to accept their cash request.
- **Without WebSockets**: The client would have to make an HTTP request every 2 seconds (*polling*):
  ```text
  Client: Any offers yet? -> Server: No
  Client: Any offers yet? -> Server: No
  Client: Any offers yet? -> Server: Yes!
  ```
  This wastes server CPU, consumes user mobile data, and creates unnecessary delays.

### The Solution: WebSockets & Socket.io
- The client and server open a **persistent, two-way (full-duplex) pipe**.
- The connection stays open indefinitely with minimal overhead.
- When an event occurs (e.g. someone clicks "I can help"), the server **pushes** data to that specific user in under 10 milliseconds:
  ```text
  [Persistent Socket Connection Active]
  ...Silence...
  Server: "Ding! User B just offered to help you." -> Client updates instantly!
  ```

### What is Socket.io?
Socket.io is a library built on top of the WebSocket protocol that adds:
1. **Automatic Reconnection**: If the user's phone goes into an elevator or loses 4G signal, Socket.io reconnects automatically once signal returns.
2. **Rooms**: The ability to group sockets together (e.g., all users in Mumbai, or two users in a private chat).
3. **HTTP Long-Polling Fallback**: If a restrictive corporate firewall blocks WebSockets, it seamlessly falls back to HTTP polling without breaking the app.

---

## 2. Core Socket.io Concepts Explained in 5 Minutes

Socket.io only has 4 core building blocks:

### 1. `io` (The Server)
The `io` object represents the entire Socket.io server instance. It controls all connected sockets.

### 2. `socket` (A Single User Connection)
Every time a browser connects to the server, a unique `socket` object is created for that specific browser tab.
- Each socket has an ID: `socket.id` (e.g., `"abc123xyz"`).
- We can attach user information to it during authentication: `socket.user = { id: '...', username: '...' }`.

### 3. Emitting & Listening to Events
Instead of URLs (`/api/users`), Socket.io uses **named events**:

```javascript
// SENDER: Emitting (sending) an event with data
socket.emit("greet", { text: "Hello World!" });

// RECEIVER: Listening to that event
socket.on("greet", (data) => {
  console.log(data.text); // "Hello World!"
});
```

### 4. Rooms (Targeted Broadcasting)
A **Room** is an arbitrary channel name on the server. You can add any socket to a room using `socket.join(roomName)`.

```javascript
// Add a user to a room
socket.join("delhi-users");

// Send a message ONLY to people in that room
io.to("delhi-users").emit("weatherAlert", { alert: "Rain incoming!" });

// Send a message to EVERYONE connected across the entire server
io.emit("globalAnnouncement", { text: "Server maintenance in 1 hour" });
```

---

## 3. How Socket.io is Structured in This Codebase

The real-time layer is split into a **Backend** (`socket/` directory in backend) and a **Frontend** (`SocketContext.jsx` in frontend).

### The 3 Core Rooms in UPI Sathi

When a user logs in and opens the app, they are automatically placed into distinct rooms:

```
                                    io (Socket Server)
                                            │
        ┌───────────────────────────────────┼───────────────────────────────────┐
        ▼                                   ▼                                   ▼
 [Room: "public-room"]          [Room: "user:65fa2b..."]              [Room: "<matchId>"]
 Everyone joins this.           Unique to each user.                  Joined ONLY by the 2
 Used for broadcast events:     Used for direct personal alerts:      swap partners when
 • newRequest                   • newMatch                            chatting:
 • requestCancelled             • confirmMatch                        • newMessage
                                • rejectMatch                         • typing
                                • completeMatch                       • stopTyping
                                • cancelActiveMatch
```

Let's look at the backend entry point: `p2p_platform_backend-main/socket/index.js`:

```javascript
export const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    // 1. Join the public room (for receiving nearby new request broadcasts)
    socket.join("public-room");

    // 2. Join their own personal private inbox room
    socket.join(`user:${socket.user.id}`);

    // 3. Register chat event handlers
    registerChatHandler(io, socket);
    sendMessage(io, socket);
    typing(io, socket);
    stopTyping(io, socket);

    socket.on("disconnect", () => {
      console.log(`${socket.id} disconnected`);
    });
  });
};
```

---

## 4. Complete Event Catalog (Every Single Socket Event)

Here is every socket event used in UPI Sathi, who triggers it, who receives it, and what happens:

### 1. Request Discovery Events (Public)

| Event Name | Triggered By | Sent To | Data Payload | What Happens in the App |
| :--- | :--- | :--- | :--- | :--- |
| `newRequest` | `POST /exchange/create` | `public-room` | `{ request: {...} }` | The **Help Someone Nearby** feed and map automatically append the new request card without refreshing. |
| `requestCancelled` | `POST /exchange/cancel/:id` or on Match | `public-room` | `{ requestId }` | The card is immediately removed from everyone's screen so no one accepts a closed request. |

### 2. Matching & Confirmation Events (Direct User Inbox)

| Event Name | Triggered By | Sent To | Data Payload | What Happens in the App |
| :--- | :--- | :--- | :--- | :--- |
| `newMatch` | Helper taps *"I can help"* (`POST /match/accept/:id`) | `user:${requesterId}` | `{ match, requester, accepter }` | Requester's phone sounds a micro-notification, radar scan stops, and the helper's profile card appears on their Home screen. |
| `confirmMatch` | Requester taps *"Accept & Chat"* (`POST /match/confirm/:matchId`) | `user:${helperId}` | `{ match }` | Helper's status switches from *"Waiting for response"* to *"Ongoing Swap"*, unlocking the direct Chat button. |
| `rejectMatch` | Requester taps *"Decline"* (`POST /match/reject/:matchId`) | `user:${helperId}` | `{ matchId }` | Helper's card is cleared, and Requester's screen resumes radar scanning for other helpers. |
| `completeMatch` | User clicks *"Mark Done"* (`POST /match/complete/:matchId`) | `user:${partnerId}` | `{ match, isFullyCompleted }` | If first person clicks, shows *"Waiting for partner..."*. When both confirm, switches status to `COMPLETED` and opens Review modal. |
| `cancelActiveMatch`| User cancels ongoing swap (`POST /match/cancel/:matchId`) | `user:${partnerId}` | `{ matchId, cancelledBy }` | Immediately closes chat room, shows an alert that the swap was cancelled, and resets the dashboard. |

### 3. Live Chat Events (Match Room)

| Event Name | Triggered By | Sent To | Data Payload | What Happens in the App |
| :--- | :--- | :--- | :--- | :--- |
| `joinRoom` | User opens `/chat/:matchId` | Server handles | `matchId` | Server verifies the user belongs to this match. If valid, adds socket to `matchId` room and resets their unread counter to 0. |
| `leaveRoom` | User navigates away from chat | Server handles | `matchId` | Socket leaves the room. |
| `sendMessage` | User clicks Send button in chat | Server handles | `{ matchId, message }` | Server saves message to MongoDB, then broadcasts `newMessage`. |
| `newMessage` | Server after saving chat | `matchId` + `user:${recipientId}` | `{ _id, sender, message, createdAt }` | Appends message bubble instantly in chat; increments red unread badge if recipient is not inside the room. |
| `typing` | User starts typing in input | `matchId` | `{ matchId, username }` | Partner sees animated *"typing..."* bouncing dots in the chat header. |
| `stopTyping` | User pauses/clears input | `matchId` | `{ matchId, username }` | Hides the typing indicator dots. |

---

## 5. How Frontend Coordinates with Socket.io

### 1. `SocketContext.jsx` (Global Connection Lifecycle)
Located in `src/context/SocketContext.jsx`:
```javascript
import { io } from "socket.io-client";

// Initializes the connection
const socketInstance = io(SOCKET_URL, {
  withCredentials: true, // Sends the JWT auth cookie automatically!
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Provides `socket` and `isOnline` to the whole React app
<socketContext.Provider value={{ socket: socketRef, isOnline }}>
  {children}
</socketContext.Provider>
```

### 2. The Golden Rule: Socket Events + TanStack Query
A common mistake junior developers make with WebSockets is trying to store all server data in raw React `useState` arrays, leading to sync bugs.

In UPI Sathi, we use the **Smart Invalidation Pattern**:
```javascript
useEffect(() => {
  if (!socket?.current) return;

  const handleUpdate = () => {
    // Tell TanStack Query: "Our local cache is old, fetch fresh data from MongoDB!"
    queryClient.invalidateQueries({ queryKey: ['activeMatches'] });
    queryClient.invalidateQueries({ queryKey: ['myRequests'] });
  };

  const s = socket.current;
  s.on('confirmMatch', handleUpdate);
  s.on('completeMatch', handleUpdate);
  s.on('cancelActiveMatch', handleUpdate);

  // ALWAYS clean up listeners when component unmounts to prevent memory leaks!
  return () => {
    s.off('confirmMatch', handleUpdate);
    s.off('completeMatch', handleUpdate);
    s.off('cancelActiveMatch', handleUpdate);
  };
}, [socket, queryClient]);
```

---

## 6. End-to-End Visual Sequence Diagram

Here is how a real-world swap coordinates over HTTP and Socket.io:

```text
Requester (User A)               Backend Server                  Helper (User B)
       │                               │                               │
       │─── 1. POST /exchange/create ──►│                               │
       │    (Saves to MongoDB)         │                               │
       │                               │── 2. emit("newRequest") ─────►│
       │                               │   (to public-room)            │
       │                               │                               │ (User B sees card on feed)
       │                               │◄── 3. POST /match/accept ─────│
       │                               │    (Helper offers help)       │
       │◄── 4. emit("newMatch") ───────│                               │
       │    (to user:UserA)            │                               │
       │                               │                               │
       │ (User A clicks "Accept")      │                               │
       │─── 5. POST /match/confirm ───►│                               │
       │                               │── 6. emit("confirmMatch") ───►│
       │                               │   (to user:UserB)             │
       │                               │                               │
       │─── 7. emit("joinRoom") ──────►│◄── 7. emit("joinRoom") ───────│
       │    (Both join room:matchId)   │    (Both join room:matchId)   │
       │                               │                               │
       │─── 8. emit("sendMessage") ───►│                               │
       │                               │── 9. emit("newMessage") ─────►│
       │                               │   (Instant chat in room)      │
       │                               │                               │
       │─── 10. POST /match/complete ─►│◄── 10. POST /match/complete ──│
       │                               │    (Both confirm handover)    │
       │◄── 11. emit("completeMatch") ─┴─── 11. emit("completeMatch") ─►│
       │    (Both redirected to rate & review)                         │
```

---

## 7. Socket.io Cheat Sheet

| Task | Code Example |
| :--- | :--- |
| **Send event to one user** | `io.to("user:" + userId).emit("event", data);` |
| **Send event to room** | `io.to("roomName").emit("event", data);` |
| **Send event to everyone** | `io.emit("globalNotice", data);` |
| **Join a room** | `socket.join("roomName");` |
| **Leave a room** | `socket.leave("roomName");` |
| **Listen to event** | `socket.on("eventName", (data) => { ... });` |
| **Remove listener (cleanup)** | `socket.off("eventName", handlerFunction);` |
