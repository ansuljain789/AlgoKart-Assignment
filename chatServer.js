const net = require('net');

// Configuration
const argvPort = process.argv[2] && Number(process.argv[2]);
const PORT = argvPort || parseInt(process.env.PORT, 10) || 4000;
const IDLE_TIMEOUT_SEC = parseInt(process.env.IDLE_TIMEOUT_SEC, 10) || 120; 

// users: Map username -> { socket, idleTimer }
const users = new Map();

function timestamp() {
  return new Date().toISOString().replace('T', ' ').split('.')[0]; 
}

function sanitizeUsername(raw) {
  if (!raw) return null;
  const clean = String(raw).replace(/[^A-Za-z0-9_-]/g, '').slice(0, 32);
  return clean || null;
}

function sanitizeLine(line) {
  return String(line).replace(/\r/g, '').replace(/\s+/g, ' ').trim();
}

function sendLine(socket, line) {
  try {
    socket.write(line + '\n');
  } catch (e) {}
}

function broadcast(line, exceptSocket = null) {
  for (const { socket } of users.values()) {
    if (socket !== exceptSocket) sendLine(socket, line);
  }
}

function setIdleTimer(username) {
  if (!users.has(username)) return;
  const entry = users.get(username);
  if (entry.idleTimer) clearTimeout(entry.idleTimer);
  if (IDLE_TIMEOUT_SEC > 0) {
    entry.idleTimer = setTimeout(() => {
      sendLine(entry.socket, 'ERR idle-timeout');
      entry.socket.end();
    }, IDLE_TIMEOUT_SEC * 1000);
  }
}

const server = net.createServer((socket) => {
  socket.setEncoding('utf8');
  let loggedInUser = null;
  let recvBuffer = '';

  sendLine(socket, 'Please login: LOGIN <username>');

  function cleanup() {
    if (loggedInUser && users.has(loggedInUser)) {
      const entry = users.get(loggedInUser);
      if (entry.idleTimer) clearTimeout(entry.idleTimer);
      users.delete(loggedInUser);
      broadcast(`INFO ${timestamp()} ${loggedInUser} disconnected`);
    }
  }

  socket.on('data', (data) => {
    recvBuffer += data;

    if (loggedInUser) setIdleTimer(loggedInUser);

    let idx;
    while ((idx = recvBuffer.indexOf('\n')) !== -1) {
      let line = recvBuffer.slice(0, idx);
      recvBuffer = recvBuffer.slice(idx + 1);

      line = sanitizeLine(line);
      if (!line) continue;

      if (!loggedInUser) {
        const parts = line.split(' ');
        if (parts.length >= 2 && parts[0].toUpperCase() === 'LOGIN') {
          const username = sanitizeUsername(parts[1]);

          if (!username) {
            sendLine(socket, 'ERR invalid-username');
            socket.end();
            return;
          }
          if (users.has(username)) {
            sendLine(socket, 'ERR username-taken');
            socket.end();
            return;
          }

          loggedInUser = username;
          users.set(username, { socket, idleTimer: null });
          sendLine(socket, 'OK');
          broadcast(`INFO ${timestamp()} ${username} joined`, socket);
          setIdleTimer(username);
        } else {
          sendLine(socket, 'ERR invalid-login-format');
          socket.end();
        }
        continue;
      }

      const first = line.split(' ')[0].toUpperCase();

      if (first === 'MSG') {
        const text = line.slice(4).trim();
        if (!text) continue;
        broadcast(`MSG ${timestamp()} ${loggedInUser} ${text}`);
      } 
      else if (first === 'WHO') {
        for (const u of users.keys()) sendLine(socket, `USER ${u}`);
      } 
      else if (first === 'DM') {
        const parts = line.split(' ');
        if (parts.length < 3) {
          sendLine(socket, 'ERR invalid-dm-format');
          continue;
        }
        const target = parts[1];
        const message = parts.slice(2).join(' ');
        if (!users.has(target)) {
          sendLine(socket, 'ERR no-such-user');
          continue;
        }
        const targetSocket = users.get(target).socket;
        sendLine(targetSocket, `DM ${timestamp()} ${loggedInUser} ${message}`);
        sendLine(socket, 'OK');
      } 
      else if (first === 'PING') {
        sendLine(socket, 'PONG');
      } 
      else {
        sendLine(socket, 'ERR unknown-command');
      }

      setIdleTimer(loggedInUser);
    }
  });

  socket.on('close', cleanup);
  socket.on('end', cleanup);
  socket.on('error', cleanup);
});

server.listen(PORT, () => {
  console.log(`TCP chat server listening on port ${PORT}`);
  console.log(`Idle timeout: ${IDLE_TIMEOUT_SEC}s`);
});
