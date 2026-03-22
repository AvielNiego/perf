'use client';

import { useEffect, useRef, useCallback } from 'react';

interface TerminalProps {
  wsUrl: string | null;
  onData?: (data: string) => void;
  insertTextRef?: React.MutableRefObject<((text: string) => void) | null>;
}

export default function Terminal({ wsUrl, onData, insertTextRef }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const fitAddonRef = useRef<any>(null);
  const commandBufferRef = useRef<string>('');

  // insertText works for both WebSocket mode and demo mode
  const insertText = useCallback((text: string) => {
    const term = xtermRef.current;
    if (!term) return;

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      // WebSocket mode: send to server
      wsRef.current.send(text);
    } else {
      // Demo mode: simulate typing into the terminal
      for (const ch of text) {
        if (ch === '\r' || ch === '\n') {
          const cmd = commandBufferRef.current.trim();
          term.write('\r\n');
          if (cmd) {
            // Simulate basic command responses
            const output = simulateCommand(cmd);
            if (output) {
              term.writeln(output);
            }
          }
          commandBufferRef.current = '';
          term.write('$ ');
        } else if (ch === '\x7f' || ch === '\b') {
          if (commandBufferRef.current.length > 0) {
            commandBufferRef.current = commandBufferRef.current.slice(0, -1);
            term.write('\b \b');
          }
        } else if (ch === '\x03') {
          // Ctrl+C
          commandBufferRef.current = '';
          term.write('^C\r\n$ ');
        } else {
          commandBufferRef.current += ch;
          term.write(ch);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (insertTextRef) {
      insertTextRef.current = insertText;
    }
  }, [insertText, insertTextRef]);

  useEffect(() => {
    if (!terminalRef.current) return;

    let cleanup = false;

    const initTerminal = async () => {
      const { Terminal: XTerm } = await import('@xterm/xterm');
      const { FitAddon } = await import('@xterm/addon-fit');
      const { WebLinksAddon } = await import('@xterm/addon-web-links');

      if (cleanup) return;

      await import('@xterm/xterm/css/xterm.css');

      const fitAddon = new FitAddon();
      fitAddonRef.current = fitAddon;

      const term = new XTerm({
        cursorBlink: true,
        fontSize: 14,
        fontFamily: "'Cascadia Code', 'Fira Code', 'Consolas', monospace",
        theme: {
          background: '#000000',
          foreground: '#00ff00',
          cursor: '#00ff00',
          selectionBackground: '#3b82f680',
          black: '#000000',
          red: '#ef4444',
          green: '#10b981',
          yellow: '#f59e0b',
          blue: '#3b82f6',
          magenta: '#8b5cf6',
          cyan: '#06b6d4',
          white: '#f3f4f6',
          brightBlack: '#6b7280',
          brightRed: '#f87171',
          brightGreen: '#34d399',
          brightYellow: '#fbbf24',
          brightBlue: '#60a5fa',
          brightMagenta: '#a78bfa',
          brightCyan: '#22d3ee',
          brightWhite: '#ffffff',
        },
        allowTransparency: true,
        scrollback: 1000,
        convertEol: true,
      });

      term.loadAddon(fitAddon);
      term.loadAddon(new WebLinksAddon());

      term.open(terminalRef.current!);
      fitAddon.fit();

      xtermRef.current = term;

      if (wsUrl) {
        // WebSocket mode: connect to real Linux server
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          term.writeln('\x1b[1;34m[PerfQuest]\x1b[0m Connected to server...');
          ws.send(JSON.stringify({ type: 'resize', cols: term.cols, rows: term.rows }));
        };

        ws.onmessage = (event) => {
          term.write(event.data);
        };

        ws.onclose = () => {
          term.writeln('\r\n\x1b[1;31m[PerfQuest]\x1b[0m Disconnected from server.');
        };

        ws.onerror = () => {
          term.writeln('\r\n\x1b[1;31m[PerfQuest]\x1b[0m Connection error.');
        };

        term.onData((data) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(data);
          }
          onData?.(data);
        });

        term.onResize(({ cols, rows }) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'resize', cols, rows }));
          }
        });
      } else {
        // Demo mode: local echo with simulated commands
        term.writeln('\x1b[1;34m[PerfQuest]\x1b[0m Demo mode — terminal simulates basic commands.');
        term.writeln('\x1b[1;33m[PerfQuest]\x1b[0m Connect a Linux server for the full experience.');
        term.writeln('');
        term.write('$ ');

        term.onData((data) => {
          // Route keyboard input through insertText for consistent handling
          insertText(data);
          onData?.(data);
        });
      }

      // Handle resize
      const resizeObserver = new ResizeObserver(() => {
        try { fitAddon.fit(); } catch {}
      });
      resizeObserver.observe(terminalRef.current!);
    };

    initTerminal();

    return () => {
      cleanup = true;
      wsRef.current?.close();
      xtermRef.current?.dispose();
    };
  }, [wsUrl]); // removed onData from deps to prevent terminal recreation

  return (
    <div
      ref={terminalRef}
      className="terminal-container w-full h-full bg-black"
      dir="ltr"
    />
  );
}

/** Simulate basic Linux commands for demo mode */
function simulateCommand(cmd: string): string {
  const parts = cmd.split(/\s+/);
  const base = parts[0];

  switch (base) {
    case 'whoami':
      return 'student';
    case 'pwd':
      return '/home/student';
    case 'echo':
      return parts.slice(1).join(' ').replace(/^["']|["']$/g, '');
    case 'ls':
      if (parts.includes('-a')) {
        return '.  ..  .welcome_note  .bashrc  bin  src  tools  kingdom_registry.txt';
      }
      return 'bin  src  tools  kingdom_registry.txt';
    case 'cat':
      if (parts[1] === '.welcome_note') {
        return 'Welcome to PerfQuest! Your secret code is: PERF2024';
      }
      return `cat: ${parts[1] || ''}: simulated file`;
    case 'hostname':
      return 'perfquest-server';
    case 'date':
      return new Date().toUTCString();
    case 'uname':
      return 'Linux perfquest-server 6.1.0 #1 SMP x86_64 GNU/Linux';
    case 'nproc':
      return '4';
    case 'uptime':
      return ' 10:00:00 up 1 day, 2:30, 1 user, load average: 0.15, 0.10, 0.05';
    case 'id':
      return 'uid=1000(student) gid=1000(student) groups=1000(student),27(sudo)';
    case 'help':
      return 'Demo mode: whoami, pwd, echo, ls, cat, hostname, date, uname, nproc, id, help\nConnect a Linux server for perf, ps, strace, gcc, and all real commands.';
    case 'clear':
      return '\x1b[2J\x1b[H';
    default:
      return `\x1b[33m[demo]\x1b[0m '${base}' — connect a real server for this command`;
  }
}
