# 02. Tech Stack & How Technologies Are Used

This document outlines each technology in the repository and its role.

---

## 1. High-Level Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React SPA)                            │
│  • React 19 + Vite (Modern bundler & ultra-fast HMR)                   │
│  • Tailwind CSS (Tailored utility styling & responsive layouts)        │
│  • React Router v7 (Client-side routing with Public & Private guards)   │
│  • TanStack Query v5 (Data fetching, caching & real-time re-fetching)  │
│  • React Leaflet + Leaflet (Interactive maps & custom marker avatars)  │
│  • Lucide React (Clean, modern iconography)                            │
│  • Socket.io-client (Real-time bi-directional event communication)     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    │ HTTP REST + Cookies
                                    │ WebSockets (Socket.io)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        BACKEND (Node.js & Express)                     │
│  • Node.js + Express (REST API endpoints & middleware pipeline)        │
│  • Socket.io Server (Real-time room management & event broadcasting)   │
│  • MongoDB + Mongoose (Document database & Geospatial indexing)        │
│  • JWT (JSON Web Tokens stored in HTTP-Only cookies for security)      │
│  • Nodemailer / Resend (OTP email delivery for password resets)        │
│  • Cookie-parser & CORS (Session & cross-origin security)              │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Technologies Explained

### 1. React 19 & Vite
- **Vite**: Provides lightning-fast build times, Instant HMR (Hot Module Replacement) during development, and optimized production bundle chunking.
- **React 19**: Modern component architecture utilizing `useContext` for global singletons (User, Socket, Location, Notifications) and `useRef` for persistent references during rapid socket events.

### 2. TanStack Query (React Query v5)
- Manages **all server state** in the frontend:
  - `useQuery`: Queries like `useMyRequests`, `useActiveMatches`, `usePublicRequests`, and `useMatchHistory`.
  - `useMutation`: Actions like `useCreateRequest`, `useConfirmMatch`, `useCompleteMatch`.
- **Why this is critical with Socket.io**:  
  Instead of manually mutating complex nested array states when a socket event arrives, we simply call:
  ```javascript
  queryClient.invalidateQueries({ queryKey: ['activeMatches'] });
  ```
  TanStack Query automatically re-fetches the latest validated database state in the background. This completely prevents state desynchronization bugs!

### 3. Tailwind CSS
- Provides high performance, zero runtime overhead CSS with utility classes.
- Customized in `tailwind.config.js` and `index.css` with:
  - Custom color tokens (`primary`, `primary-hover`, `background`, `surface`, `border`, `muted`).
  - Keyframe animations like `@keyframes premium-badge-pulse` and radar scans.
  - Responsive utilities for fluid mobile-to-desktop transitions (`md:grid`, `md:col-span-7`).

### 4. React-Leaflet & Leaflet
- Renders OpenStreetMap tiles directly in the browser with zero API costs.
- Custom `L.divIcon`: Creates pulsing user markers and requester cards showing their profile avatar directly on the map.
- Bounds auto-fitter (`RequestsMapBoundsUpdater`): Automatically pans and zooms the map so the user and all nearby request markers are visible simultaneously.

---

## 3. Backend Technologies Explained

### 1. Node.js & Express
- The REST API provides endpoints structured under modular controllers:
  - `/api/v1/auth`: Register, login, google login, send-otp, verify-otp, forgot-password, logout.
  - `/api/v1/exchange`: Create request, get my requests, get public nearby requests, cancel request.
  - `/api/v1/match`: Accept request (offer help), confirm offer, reject offer, complete swap, cancel active match.
  - `/api/v1/chat`: Fetch chat room messages with cursor-based pagination.
  - `/api/v1/reviews` & `/api/v1/reports`: Ratings and moderation reporting.

### 2. MongoDB & Mongoose Geospatial Indexing
- The core models are:
  - **`User`**: Credentials, avatar, trustScore, reviewsCount, isVerified.
  - **`ExchangeRequest`**: Amount, type (`NEED_CASH` / `NEED_UPI`), location (GeoJSON Point), status (`ACTIVE`, `MATCHED`, `COMPLETED`, `CANCELLED`), note, expiresAt.
  - **`Match`**: Links `request`, `requester`, and `accepter`. Tracks completion flags (`requesterCompleted`, `accepterCompleted`) and unread message counters (`requesterUnread`, `accepterUnread`).
  - **`Chat`**: `matchId`, `sender`, `message`, timestamps.
  - **`Review`** & **`Report`**: Post-swap feedback and safety reports.

#### Geospatial Queries (`$near` / `$geoWithin`)
When finding nearby requests, MongoDB uses a 2dsphere index on the `location.coordinates` (`[longitude, latitude]`) field:
```javascript
// Example MongoDB query in exchangeController.js:
ExchangeRequest.find({
  status: "ACTIVE",
  expired: false,
  location: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [longitude, latitude]
      },
      $maxDistance: radiusInKm * 1000 // Convert km to meters
    }
  }
})
```

### 3. Authentication & Security
- **JWT in HTTP-Only Cookies**: Tokens are never stored in `localStorage` (protecting against XSS attacks).
- **Socket Authentication**: When the browser connects to Socket.io, it sends the HTTP cookie along with the handshake headers. The backend middleware validates the JWT and attaches `socket.user = decoded` to the socket instance.
