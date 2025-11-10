

# 💬 Real-Time Terminal Chat Application (WebSocket + Node.js)

This is a real-time chat application meant for terminal use — no browser required!  
Multiple users can connect, log in with unique usernames, and send chat messages with timestamps.

---

## 🚀 Features

- **No Database Required:** All data is kept in memory
- **Unique Username Login:** Ensures each user is distinct
- **Real-Time Messaging:** Instant updates for all connected users
- **Message Timestamps:** Each message is time-stamped
- **List Online Users:** Instantly view all currently connected users
- **Cross-Platform:** Works on Windows, Linux, and Mac

---

## 🛠️ Requirements

| Software         | Version    |
|------------------|-----------|
| Node.js          | v14+       |
| npm              | Comes with Node.js |
| ncat / netcat    | (Terminal Chat Client) |

### 👉 Install Ncat on Windows

Download from Nmap:  
https://nmap.org/download.html

After installation, check by running:
```bash
ncat --version
```

---

## 📦 1. Clone or Download the Project

```bash
git clone https://github.com/ansuljain789/AlgoKart-Assignment.git
cd AlgoKart-Assignment
```

---

## 📥 2. Install Dependencies

```bash
npm install
```

---

## ▶️ 3. Start the Chat Server

```bash
node server.js
```

You should see:

```bash
✅ Chat Server Running on ws://localhost:4000
```

---

## 💻 4. Connect Clients (Open Multiple Terminals)

Use ncat (or nc) to connect:

```bash
ncat localhost 4000
```

Open another terminal and run the same command above to simulate more users.

---

## 🔐 5. Commands to Use

| Command           | Example                  | Description                                |
|-------------------|-------------------------|--------------------------------------------|
| `LOGIN <username>`| `LOGIN Amaan`           | Log in with a unique username              |
| `MSG <message>`   | `MSG Hello Everyone!`   | Send a chat message to all users           |
| `USERS`           | `USERS`                 | Display a list of users currently online   |

---

## 🧪 Example Chat Flow

**Client 1:**
```bash
LOGIN Amaan
OK Logged in as Amaan
MSG Hello everyone 👋
```

**Client 2:**
```bash
LOGIN John
OK Logged in as John
MSG Hi Amaan!
```

**Chat Output For Both:**
```bash
[10:31:14] ✅ Amaan joined the chat
[10:31:22] Amaan: Hello everyone 👋
[10:31:40] ✅ John joined the chat
[10:31:44] John: Hi Amaan!
```

---

## 🎥 6. Screen Recording (Mandatory for Submission)

**Record the following:**
- Starting the server
- Connecting at least 2 clients
- Logging in and sending messages

**Recommended tool (Windows):**
- Press `Windows + G` → Use the built-in Screen Recorder

**Upload video** to Google Drive

---

**📹 Recording Link:** `<paste-here>`

---

## 🏁 Stop The Server

Press:

```
CTRL + C
```