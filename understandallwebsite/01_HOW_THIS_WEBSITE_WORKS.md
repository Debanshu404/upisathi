# 01. How This Website Works

## 1. The Real-World Problem

In India, UPI (Unified Payments Interface) is everywhere—street vendors, grocery stores, restaurants, and taxis. However, two common situations regularly cause headaches for everyday citizens:

1. **Need Physical Cash Instantly**:
   - An ATM is broken, out of cash, or 2 km away.
   - You need ₹200 or ₹500 physical cash (for an auto rickshaw, entry ticket, cash-only stall, or tip).
   - You have ample UPI / bank balance on your phone, but zero physical notes in your wallet.

2. **Need Digital Money (UPI Bank Transfer) Urgently**:
   - You have cash in hand, but your bank account is low.
   - You urgently need to pay an online bill, recharge your phone, or send money to a family member via UPI.

Traditionally, people awkwardly ask strangers near a shop: *"Bhaiya, can I send you ₹500 on Google Pay and you give me cash?"*

---

## 2. The Solution: UPI Sathi (PeerSync)

**UPI Sathi** turns this awkward transaction into a safe, instant, peer-to-peer exchange platform:
- Matches two nearby people whose needs complement each other.
- Free and decentralized: no platform transaction fees or middleman holding escrow.
- In-person verification: Users chat, agree on a crowded public spot (like a metro exit or coffee shop), hand over physical cash, verify the UPI payment directly in their banking app (Google Pay, PhonePe, Paytm), and both mark the swap complete.
- Reputation & Safety: Users build a **Trust Score (1.0 to 5.0)** with community reviews, and verified badges keep bad actors out.

---

## 3. The Two Core Perspectives & User Journeys

### Journey A: The Requester (Needs Cash or UPI)

```text
[Home Screen]
     │
     ▼
[Click "Ask for Cash or UPI"]
     │
     ▼
[4-Step Wizard: Type, Amount, Radius & Timer, Meetup Note]
     │
     ▼
[Home: Live Radar Scanning State] ──(Socket alert: helper offers)──► [Offer Received Card]
                                                                             │
                              ┌──────────────────────────────────────────────┴──────────┐
                              ▼                                                         ▼
                     [Decline Offer]                                           [Accept & Chat]
                              │                                                         │
                     (Resumes Scanning)                                     [Private Chat Room]
                                                                                        │
                                                                                        ▼
                                                                           [Meet Up & Exchange Funds]
                                                                                        │
                                                                                        ▼
                                                                             [Both Click "Mark Done"]
                                                                                        │
                                                                                        ▼
                                                                            [Rate & Review Partner]
```

1. **Create Request**: Choose whether you need Cash (pay via UPI) or need UPI (pay via Cash). Enter amount (e.g., ₹500), search radius (e.g., 5 km), and an expiry timer (e.g., 20 mins).
2. **Scan Nearby**: The request is published with GPS coordinates. The home screen displays an active radar scan.
3. **Review Offers**: When a nearby user taps *"I can help"*, you see their avatar, username, and trust score. You can decline or accept.
4. **Coordinate & Swap**: Once accepted, you enter a private chat to pick a spot, meet up, exchange money, and both confirm completion.

---

### Journey B: The Helper (Fulfilling Someone Else's Request)

```text
[Home Screen] ──► [Click "Help Someone Nearby"]
                            │
                            ▼
           [Feed of Active Nearby Requests]
           (Filtered by Distance: 1km - 10km)
                            │
                            ▼
                 [Click "I Can Help"]
                            │
                            ▼
              [Waiting for Requester to Accept]
                            │
             (Requester confirms via Socket.io)
                            │
                            ▼
           [Notification + Chat Unlocked]
                            │
                            ▼
                 [Meet, Swap, Mark Done]
```

1. **Browse Feed / Map**: View people within your vicinity who need help. The cards show what they need, how much, how far away they are, and how much time is left.
2. **Send Offer**: Click *"I can help"*. A notification immediately pings the requester's device.
3. **Chat & Complete**: Once the requester accepts, you're connected in chat. After trading cash and confirming the UPI transfer in your banking app, you both tap *"Mark Done"*.

---

## 4. Safety & Trust Mechanisms

- **No Third-Party Escrow Risk**: Because the exchange happens face-to-face in person, neither party needs to deposit money into the app. You check your bank app on the spot.
- **Double Confirmation**: An exchange is only marked `COMPLETED` when **both** parties click *"Mark Done"*.
- **Mutual Review System**: After completion, both users rate each other and leave feedback that calculates the public **Trust Score**.
- **Report & Block**: If someone doesn't show up or acts suspiciously, either user can file a report with evidence tags.
