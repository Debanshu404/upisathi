# PeerSync Frontend Architecture & UI Overview

This document provides a comprehensive picture of the PeerSync React frontend application, explaining what screens are shown, when they are shown, how routing flows, and the simplified user terminology system.

---

## 1. Application Routing & State Lifecycles

The application is structured as a Single Page Application (SPA) using React Router. It separates screens into public (guest) routes and protected (authenticated) routes.

### Route Map

```mermaid
graph TD
    classDef guest fill:#f9f,stroke:#333,stroke-width:2px;
    classDef protected fill:#bbf,stroke:#333,stroke-width:2px;
    classDef layout fill:#bfb,stroke:#333,stroke-width:2px;

    Login["Login Screen (/login)"]:::guest
    Register["Register Screen (/register)"]:::guest
    
    Layout["Main Layout Wrapper"]:::layout
    Home["Home Screen (/)"]:::protected
    MySwaps["My Swaps (/activity)"]:::protected
    Chats["Chats list (/chats)"]:::protected
    Chat["Chat Room (/chat/:matchId)"]:::protected
    Profile["Profile Screen (/profile)"]:::protected
    CreateRequest["Create Request (/create-request)"]:::protected
    FindRequests["Help Nearby (/find-requests)"]:::protected

    %% Navigation flows
    Login -->|Success| Home
    Register -->|Success| Login
    
    subgraph Protected Area (Requires Authentication)
        Layout --> Home
        Layout --> MySwaps
        Layout --> Chats
        Layout --> Profile
        Layout --> CreateRequest
        Layout --> FindRequests
    end

    Home -->|Ask for Cash/UPI| CreateRequest
    Home -->|Help Someone Nearby| FindRequests
    CreateRequest -->|Post Request| Home
    Home -->|Accept Offer (inline)| Chat
    Chats -->|Tap Conversation| Chat
```

---

## 2. Terminology Normalization System

To make the app intuitive for the general public, all internal developer terms (backend schema fields, API routes, and socket events) are translated to clean, public-facing language in the UI:

| Backend / API Term | Frontend UI Term | Meaning |
| :--- | :--- | :--- |
| `Request` | **Swap Request** | A post showing a need for cash or UPI. |
| `Match` | **Swap Partner** / **Helper** | The person who agreed to trade cash with the user. |
| `Pending Match` | **Offer Received** | Someone who has offered to help with a request. |
| `Active Match / Exchange` | **Ongoing Swap** | The transaction currently in progress. |
| `Confirm Match` | **Accept Offer** | Selecting a helper and locking in the transaction. |
| `Reject Match` | **Decline Offer** | Declining a helper's swap offer. |
| `Complete Match` | **Mark Done** / **Finish Swap** | Specifying that the cash/UPI exchange was successful. |
| `Cancel Match` | **Cancel Swap** | Manually terminating the ongoing trade. |

---

## 3. Step-by-Step User Exchange Flows

Here is how the main user journeys flow through the screens and real-time state changes.

### Flow A: Posting a Request & Getting Help (Requester Perspective)

```text
[Home (Default)] ➔ [Create Request Form] ➔ [Home (Searching State)]
                                                 │
                                                 ▼ (Help offer comes: 'newMatch' event)
                                        [Home (Offer Received State)]
                                                 ├──► Decline ➔ (Resumes searching inline)
                                                 └──► Accept ➔ (ConfirmMatch API + redirect to Chat)
```

1. **Start Request**: The user clicks **Ask for Cash/UPI** on the **Home** dashboard.
2. **Form Entry**: They fill out the step-by-step form (preference ➔ amount ➔ search radius / timer ➔ location instructions).
3. **Home Search State**: Upon posting, the frontend calls `POST /exchange/create` and redirects the user back to **Home** (`/`). The top hero card transitions into the **Searching...** state showing an inline radar pulse animation.
4. **Evaluating Offers**: When a helper clicks "I can help", the backend sends a socket notification `newMatch`, and the Home hero card automatically updates to show the helper's profile card.
   * If the creator clicks **Decline**, the offer is rejected, and the card resumes scanning.
   * If the creator clicks **Accept & Chat**, the backend sets status to `MATCHED` (locking in the partner) and redirects the user directly to the **Chat** screen.

---

### Flow B: Helping Someone Nearby (Helper Perspective)

```text
[Home] ➔ [Help Someone Nearby Feed] ➔ [Click 'I can help'] ➔ [Offer Sent/Wait State]
                                                                        │
                                                                        ▼ (Requester confirms: 'confirmMatch')
                                                                 [Direct Chat Opened]
```

1. **Browse Feed**: The user clicks **Help Someone Nearby** on the Home page.
2. **Select Request**: They find a nearby request (e.g. *joydip needs Cash, pays UPI*).
3. **Offer Help**: They click **I can help**. The app sends `POST /match/accept/:requestId` to the backend. The request disappears from the feed, and a success banner confirms the offer has been sent.
4. **Waiting for Approval**: The helper waits. Under **My Swaps** ➔ **Active**, their offer is listed as pending.
5. **Offer Accepted**: Once the requester accepts, the helper receives the `confirmMatch` socket event, and their card changes to show a **Chat** button, unlocking direct messaging.

---

### Flow C: Swapping and Finalizing (Meet Up)

```text
[Chat / Home card] ➔ [Meet up at Meeting Point] ➔ [Swap Funds] ➔ [Click 'Mark Done']
                                                                          │
                                                                          ▼ (Both users click 'Mark Done')
                                                                   [Swap Completed]
```

1. **Communication**: Partners chat inside the app to agree on a public meeting point.
2. **In-Person Exchange**: They meet, trade physical cash, and verify digital UPI transfer in their bank apps.
3. **Confirming Completion**:
   * Both users go to the ongoing card on the **Home Screen** (or inside **Chat**) and click **Mark Done**.
   * When the first user clicks it, the button changes to "Done ✓" and displays *"Waiting for the other person to confirm..."*.
   * Once both click **Mark Done**, the backend sets status to `COMPLETED`, and it is recorded in **History** under **Successful Swaps**.

---

## 4. The Live Layer (Real-Time Socket.io Integration)

To support instant communication and transaction updates without manual page refreshes, the frontend implements a real-time event system driven by Socket.io.

### Architecture & Connection State
* **`SocketContext.jsx`**: Initializes the socket connection to `VITE_SOCKET_URL` (controlled by cookie-based authentication) and exposes the connection status (`isOnline`) globally.
* **Auto-Reconnect**: The socket automatically reconnects if the network drops.

### Key Events & Triggers

The following events synchronize status dynamically across user screens:

| Event Name | Sent When... | UI Action taken |
| :--- | :--- | :--- |
| `newRequest` | A user posts a new cash request nearby. | **Help Nearby** feed (`FindRequests.jsx`) and Dashboard stats immediately append/refresh without manual reload. |
| `requestCancelled` | A poster cancels their pending request. | The request is removed from all nearby helpers' lists in real-time. |
| `newMatch` | A helper clicks **"I can help"** on a request card. | The requester's Home hero card stops scanning, sounds a micro-notification, and lists the helper's profile card inline. |
| `confirmMatch` | The requester clicks **"Accept & Chat"** on a helper's offer. | The accepted helper's screen transitions from "Pending Offer" to "Ongoing Swap," unlocking the chat route. All other helpers receive socket events to clear their screens. |
| `rejectMatch` | The requester declines a helper's offer. | The declined helper's view resets, and the requester's Home hero card resumes searching. |
| `newMessage` | A user sends a text message in the chat room. | Instantly appends the chat bubble in `Chat.jsx` and updates the unread badge in the conversation list (`Chats.jsx`). |
| `typing` | A user is typing a message in the chat screen. | Renders three bouncing dots on the partner's chat header to show active composition. |
| `completeMatch` | A user clicks **"Mark Done"**. | Syncs status between both screens. The first user to click sees a *"Waiting for partner"* status; once both confirm, the UI redirects both to the Swap Completed page. |
| `cancelActiveMatch` | A user terminates an active swap. | Closes the chat screen immediately and shows a *"Swap Cancelled"* alert, redirecting both back to their respective dashboards. |

---

## 5. Detailed Screen Breakdown

Here is a breakdown of what is displayed on each screen and the conditions under which they appear:

### 1. Home Screen (`Home.jsx` | Route: `/`)
* **When shown**: The main dashboard after logging in.
* **What is shown**:
  * **Hero State Card**: Renders one of four states depending on active requests:
    1. **State 1 (No Request)**: "Need Cash or UPI?" preference selector card + "Ask for Cash/UPI" button.
    2. **State 2 (Searching...)**: Inline sonar radar animation grid with cycling status logs and a "Cancel Search" button.
    3. **State 3 (Offer Received)**: Helper profile card list showing avatar, trust score, and Decline / Accept & Chat actions.
    4. **State 4 (Ongoing Swap)**: Matched partner profile, send/receive amount indicators, agreed meeting point, and cancel/complete actions.
  * **Your Activity Grid**: Three metrics cards showing current stats (Live Requests, Offers Received, Successful Swaps). Clicking any card navigates to My Swaps (`/activity`).
  * **Quick Actions**: Prominent, full-width navigation link to **Help Someone Nearby** showing a red unread badge, and a disabled card for **Nearby Helpers** (Soon).

### 2. Help Someone Nearby (`FindRequests.jsx` | Route: `/find-requests`)
* **When shown**: When the user clicks the "Help Someone Nearby" card on the home screen to assist other local users.
* **What is shown**:
  * **Filterable Request Cards**: A feed of active requests posted by other users within the search radius. Each card shows:
    - Creator's profile picture, username, and distance (e.g. `5km away`).
    - Transaction amount (e.g. `₹500`).
    - Flow badges (e.g., `Pays UPI ➔ Needs Cash` or `Pays Cash ➔ Needs UPI`).
    - Optional descriptive note from the creator.
    - Expiration countdown progress bar (e.g. `Closing in 20 mins left`).
    - Action button: **I can help** (sends a help offer to the creator).
  * **Empty State**: If no requests are active nearby, a map pin icon is displayed with the message: *"No one needs help nearby right now. Check back later!"*.

### 3. Ask for Cash or UPI (`CreateRequest.jsx` | Route: `/create-request`)
* **When shown**: Step-by-step wizard opened when a user requests cash or UPI.
* **What is shown**:
  * **Step 1: Swap Selection**: Two big toggle buttons:
    - **Get Physical Cash** (Pay with UPI, get cash in hand).
    - **Get UPI Transfer** (Give cash, get UPI in bank).
  * **Step 2: Amount Entry**: A currency text input showing a large rupee symbol (`₹`) with quick-select buttons for `₹100`, `₹500`, and `₹1,000`.
  * **Step 3: Distance & Time (Who can see this?)**: Two range sliders:
    - **How far to search**: Radius adjustment from 1 km to 10 km.
    - **Time limit for responses**: Expiration timer from 5 minutes to 60 minutes.
  * **Step 4: Instructions/Note**: A text area to write custom details (e.g., meeting spot notes or description, e.g. *"I'm wearing a red jacket near the cafe..."*).
  * **Post Swap Request Button**: Submits the request and redirects the user back to the **Home Screen** (`/`) to scan inline.

### 4. My Swaps (`ActivityCenter.jsx` | Route: `/activity`)
* **When shown**: Main status/history manager page.
* **What is shown**:
  * **Active Tab**:
    - **My Live Requests**: Your pending posts waiting for responses, with details on radius and expiry times.
    - **Offers Received**: Helper applications waiting for your confirmation, with **Accept Offer** / **Decline Offer** options.
    - **Ongoing Swaps**: Live exchanges that have been accepted. Features a progress stepper timeline tracking: `Offer Accepted` ➔ `Meet & Chat` ➔ `Finish Swap`.
  * **History Tab**:
    - **Past Deals**: Transactions that were matched but cancelled before final completion.
    - **Successful Swaps**: History of completed transactions.
    - **Cancelled & Expired Swaps**: Requests that timed out or were manually closed.

### 5. Conversations List (`Chats.jsx` | Route: `/chats`)
* **When shown**: Main messages screen.
* **What is shown**:
  * **Conversation Card List**: A list of active swaps. Each row shows:
    - Swap partner's avatar, username, and active status indicator.
    - Unread messages indicator badge (in red).
    - Swap direction details (e.g., `UPI ➔ Cash`) and total rupee amount.
    - Status badge: `Ongoing Swap`.
    - **Location preview text**: Snippet displaying the meeting spot (e.g. *"Spot: Café Coffee Day"*) or a coordination call-to-action prompt.

### 6. Chat Room (`Chat.jsx` | Route: `/chat/:matchId`)
* **When shown**: Private chat between the two swap partners.
* **What is shown**:
  * **Swap Details Collapsible Panel**: Tap the header to expand detailed swap instructions, showing:
    - **You Send** and **You Receive** methods.
    - **Meeting Point** location instructions.
  * **Messages Feed**: Chat dialogue bubbles separated by sender (blue bubbles for the current user, white bubbles for the partner), showing message timestamp logs.
  * **Typing Indicator**: Animates three bounce dots when the counterpart is active.
  * **Chat Input Bar**: Rounded text box with a send icon button.

### 7. Profile Screen (`Profile.jsx` | Route: `/profile`)
* **When shown**: Authenticated user details dashboard.
* **What is shown**:
  * User profile details (avatar, username, email, trust score).
  * **Help & Safety Guide Accordion**: Combines **Safety Rules** and **How to Swap** guides as clean, interactive collapsible panels.
