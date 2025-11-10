# TCP Chat Server (Node.js - Standard Library Only)

This project is a simple multi-user real-time chat server built using **only the Node.js `net` module** (no frameworks, no database).  
Multiple clients can connect, log in with a username, and chat with each other in real time.

---

## 📌 Features

- Runs on **port 4000** by default.
- Allows **multiple concurrent clients**.
- **LOGIN <username>** authentication (unique usernames only).
- **MSG <text>** broadcasts messages to all users.
- **WHO** lists all currently connected users.
- **DM <username> <text>** sends private messages.
- **PING → PONG** heartbeat response.
- **Auto idle timeout (60s)** disconnects inactive users.
- **Timestamps added** to all messages for clarity.
- Clean disconnection handling with notifications.

---

## 🗂 Message Format

| Action | Client Sends | Server Responds / Broadcasts |
|-------|--------------|-----------------------------|
| Login | `LOGIN <username>` | `OK` or `ERR username-taken` |
| Broadcast message | `MSG hello` | `MSG <timestamp> <username> hello` |
| Private message | `DM Yudi hey` | `DM <timestamp> Naman hey` (only to Yudi) |
| List active users | `WHO` | `USER <username>` repeated |
| Heartbeat | `PING` | `PONG` |
| Disconnect | *(close connection)* | `INFO <timestamp> <username> disconnected` |

---

## 🚀 How to Run the Server

### 1. Install Node.js  
https://nodejs.org/

### 2. Save your server file as:
