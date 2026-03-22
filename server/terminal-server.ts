/**
 * WebSocket Terminal Server
 *
 * Bridges browser WebSocket connections to SSH sessions on the Linux container.
 * Each WebSocket connection gets its own PTY session.
 */

import { createServer, IncomingMessage } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { Client as SSHClient, ClientChannel } from 'ssh2';

const PORT = parseInt(process.env.WS_PORT || '8080');
const SSH_HOST = process.env.TERMINAL_HOST || 'localhost';
const SSH_PORT = parseInt(process.env.TERMINAL_PORT || '2222');
const SSH_USER = process.env.TERMINAL_USER || 'student';
const SSH_PASS = process.env.TERMINAL_PASSWORD || 'perfquest';

const server = createServer();
const wss = new WebSocketServer({ server });

console.log(`Terminal WebSocket server starting on port ${PORT}`);
console.log(`SSH target: ${SSH_USER}@${SSH_HOST}:${SSH_PORT}`);

wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
  console.log(`New WebSocket connection from ${req.socket.remoteAddress}`);

  const ssh = new SSHClient();
  let stream: ClientChannel | null = null;

  ssh.on('ready', () => {
    console.log('SSH connection established');

    ssh.shell(
      {
        term: 'xterm-256color',
        cols: 80,
        rows: 24,
      },
      (err: Error | undefined, s: ClientChannel) => {
        if (err) {
          console.error('Shell error:', err);
          ws.send('\r\n[PerfQuest] Failed to open shell.\r\n');
          ws.close();
          return;
        }

        stream = s;

        // SSH → WebSocket
        s.on('data', (data: Buffer) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(data.toString('utf-8'));
          }
        });

        s.stderr.on('data', (data: Buffer) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(data.toString('utf-8'));
          }
        });

        s.on('close', () => {
          console.log('SSH stream closed');
          ws.close();
        });
      }
    );
  });

  ssh.on('error', (err: Error) => {
    console.error('SSH error:', err.message);
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(`\r\n[PerfQuest] Connection error: ${err.message}\r\n`);
    }
    ws.close();
  });

  // WebSocket → SSH
  ws.on('message', (data: Buffer | string) => {
    const msg = data.toString();

    // Check for resize messages
    try {
      const parsed = JSON.parse(msg);
      if (parsed.type === 'resize' && stream) {
        stream.setWindow(parsed.rows, parsed.cols, 0, 0);
        return;
      }
    } catch {
      // Not JSON, treat as terminal input
    }

    if (stream) {
      stream.write(msg);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket closed');
    ssh.end();
  });

  ws.on('error', (err: Error) => {
    console.error('WebSocket error:', err.message);
    ssh.end();
  });

  // Connect SSH
  ssh.connect({
    host: SSH_HOST,
    port: SSH_PORT,
    username: SSH_USER,
    password: SSH_PASS,
    readyTimeout: 10000,
  });
});

server.listen(PORT, () => {
  console.log(`Terminal WebSocket server running on ws://0.0.0.0:${PORT}`);
});
