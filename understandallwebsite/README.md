# UPI Sathi — Complete Architecture & Understanding Guide

Welcome to the **UPI Sathi (PeerSync)** architecture guide! This directory is written to give you a clear, intuitive, and practical understanding of how this entire platform functions, how the technologies fit together, and especially **how Socket.io powers the real-time layer**.

> 💡 **Designed for Full-Stack Developers:**  
> Since you already know the full stack (React, Node.js, Express, MongoDB, REST APIs), general stack concepts are kept concise and to the point. **Socket.io is given a comprehensive, visual, zero-jargon breakdown** so you can master how real-time events, rooms, and notifications work in this exact application.

---

## 📚 Guide Index

| Document | Description | Key Topics |
| :--- | :--- | :--- |
| **[01. How This Website Works](./01_HOW_THIS_WEBSITE_WORKS.md)** | Core concept, real-world problem, and complete user journeys. | P2P Cash-UPI swapping, requester vs helper journeys, in-person safety. |
| **[02. Tech Stack & Integration](./02_TECH_STACK_AND_HOW_THEY_ARE_USED.md)** | How React 19, Node/Express, MongoDB, Leaflet, and TanStack Query work together. | Frontend state, geospatial queries (GeoJSON), cookie auth, query invalidation. |
| **[03. Socket.io Deep Dive](./03_SOCKET_IO_DEEP_DIVE.md)** ⭐ | **The complete Socket.io guide.** Everything from basic concepts to this project's real-time events. | WebSockets vs HTTP, Rooms, `io.to()`, `socket.emit()`, event catalog, TanStack Query integration. |
| **[04. End-to-End Flows & Events](./04_END_TO_END_FLOWS_AND_EVENTS.md)** | Step-by-step trace of every action from creating a swap to completing it. | State machines, sequence diagrams, database transitions, and socket payloads. |

---

## ⚡ 60-Second System Summary

```
                      +---------------------------------------+
                      |          Frontend (React 19)          |
                      |  Vite + TailwindCSS + TanStack Query  |
                      +-------------------+-------------------+
                                          |
                        HTTP REST (Axios) | Socket.io (WebSocket)
                        CRUD, Auth, Maps  | Real-Time Alerts, Chat
                                          |
                      +-------------------v-------------------+
                      |      Backend (Node.js + Express)      |
                      |          Socket.io Server             |
                      +-------------------+-------------------+
                                          |
                                Mongoose ODM / GeoJSON
                                          |
                      +-------------------v-------------------+
                      |           MongoDB Database            |
                      |  Users, Exchanges, Matches, Chats     |
                      +---------------------------------------+
```

1. **User Posts Request**: User needs ₹500 cash and pays UPI. Coordinates are sent via Leaflet/GPS.
2. **Instant Broadcast**: Backend saves the request in MongoDB and emits a `newRequest` event through Socket.io to the `public-room`.
3. **Nearby Helpers See It**: Connected users nearby receive the event without refreshing.
4. **Helper Offers Assistance**: A helper taps *"I can help"*. Socket.io emits `newMatch` directly to the requester's private user room (`user:<userId>`).
5. **Requester Confirms**: Requester clicks *"Accept & Chat"*. Backend creates a Match record, locks the request, and emits `confirmMatch`.
6. **Live Coordination**: Both join the private room `matchId` to chat in real-time, pick a public meetup spot, exchange cash & UPI, and double-confirm completion.
