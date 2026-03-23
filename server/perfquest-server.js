/**
 * PerfQuest Terminal Server
 *
 * WebSocket server that creates clean per-level bash sessions.
 * Each connection gets an isolated temp directory with only the files
 * needed for the requested level.
 */

const http = require('http');
const { WebSocketServer } = require('ws');
const fs = require('fs');
const path = require('path');
const os = require('os');
let pty;
try { pty = require('node-pty'); } catch { pty = null; }

const PORT = process.env.PORT || 8080;
const HOME = os.homedir();
const BIN_DIR = path.join(HOME, 'perfquest/bin');
const SRC_DIR = path.join(HOME, 'perfquest/src');
const FLAMEGRAPH_DIR = path.join(HOME, 'FlameGraph');

// Per-level file manifests: what files each level needs
const LEVEL_FILES = {
  // Act 1: Tutorial
  '1-1': { files: [], description: 'Basic commands' },
  '1-2': { files: ['.welcome_note'], description: 'Hidden files' },
  '1-3': { files: ['logs/app.log'], description: 'Grep and pipes' },
  '1-4': { files: ['logs/'], description: 'Find files' },
  '1-5': { files: ['logs/'], description: 'Boss: log analysis' },

  // Act 2: System Concepts
  '2-1': { bins: ['counter'], description: 'Processes' },
  '2-2': { bins: ['thread_demo'], description: 'Threads' },
  '2-3': { bins: ['counter'], description: 'CPU cycles' },
  '2-4': { files: [], description: 'Memory hierarchy' },
  '2-5': { bins: ['switch_demo'], description: 'Context switches' },
  '2-6': { bins: ['counter'], description: 'Syscalls' },
  '2-7': { srcs: ['calc.c'], bins: ['calc'], description: 'Debug symbols' },
  '2-8': { files: [], description: 'Counting vs sampling' },
  '2-9': { bins: ['thread_demo', 'counter'], srcs: ['calc.c'], description: 'Boss' },

  // Act 3: perf Fundamentals
  '3-1': { files: [], description: 'perf list' },
  '3-2': { bins: ['slow_calc', 'counter'], description: 'perf stat' },
  '3-3': { bins: ['cache_friendly', 'cache_unfriendly'], description: 'perf stat -e' },
  '3-4': { bins: ['slow_calc'], description: 'perf top' },
  '3-5': { bins: ['slow_calc'], description: 'perf record' },
  '3-6': { bins: ['deep_calls'], description: 'Self vs children' },
  '3-7': { bins: ['multi_path'], description: 'Call graph' },
  '3-8': { bins: ['mystery_slow'], description: 'Boss: diagnosis' },

  // Act 4: Intermediate
  '4-1': { bins: ['calc'], srcs: ['calc.c'], description: 'perf annotate' },
  '4-2': { bins: ['complex_app'], flamegraph: true, description: 'Flame graphs' },
  '4-3': { bins: ['complex_app'], flamegraph: true, description: 'Filtered flames' },
  '4-4': { bins: ['slow_calc', 'counter'], description: 'Event types' },
  '4-5': { bins: ['slow_calc'], description: 'Filtering' },
  '4-6': { bins: ['deep_calls'], description: 'Stack unwinding' },
  '4-7': { bins: ['slow_calc', 'cache_unfriendly', 'complex_app'], flamegraph: true, description: 'Boss' },

  // Act 5: Advanced
  '5-1': { bins: ['data_processor'], description: 'perf probe' },
  '5-2': { bins: ['latency_app'], description: 'perf sched' },
  '5-3': { bins: ['matrix_multiply'], description: 'perf mem' },
  '5-4': { bins: ['false_sharing_demo'], description: 'perf c2c' },
  '5-5': { bins: ['io_heavy_app'], flamegraph: true, description: 'Off-CPU' },
  '5-6': { bins: ['mystery_slow', 'complex_app'], flamegraph: true, description: 'Methodology' },
  '5-7': { bins: ['slow_calc', 'false_sharing_demo', 'matrix_multiply', 'io_heavy_app'], flamegraph: true, description: 'Final boss' },
};

function setupLevelDir(levelId) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), `perfquest-${levelId}-`));
  const manifest = LEVEL_FILES[levelId] || { files: [] };

  // Copy binaries
  if (manifest.bins) {
    const binDir = path.join(tmpDir, 'bin');
    fs.mkdirSync(binDir, { recursive: true });
    for (const bin of manifest.bins) {
      const src = path.join(BIN_DIR, bin);
      const dst = path.join(binDir, bin);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dst);
        fs.chmodSync(dst, 0o755);
      }
    }
  }

  // Copy source files
  if (manifest.srcs) {
    const srcDir = path.join(tmpDir, 'src');
    fs.mkdirSync(srcDir, { recursive: true });
    for (const src of manifest.srcs) {
      const srcPath = path.join(SRC_DIR, src);
      const dstPath = path.join(srcDir, src);
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, dstPath);
      }
    }
  }

  // Copy level-specific files
  if (manifest.files) {
    for (const file of manifest.files) {
      const srcPath = path.join(HOME, file);
      const dstPath = path.join(tmpDir, file);
      if (fs.existsSync(srcPath)) {
        if (fs.statSync(srcPath).isDirectory()) {
          fs.cpSync(srcPath, dstPath, { recursive: true });
        } else {
          fs.mkdirSync(path.dirname(dstPath), { recursive: true });
          fs.copyFileSync(srcPath, dstPath);
        }
      }
    }
  }

  // Copy .welcome_note for Act 1
  if (levelId.startsWith('1-')) {
    const src = path.join(HOME, '.welcome_note');
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(tmpDir, '.welcome_note'));
    }
  }

  // Copy kingdom registry for Act 1
  const regSrc = path.join(HOME, 'kingdom_registry.txt');
  if (fs.existsSync(regSrc) && levelId.startsWith('1-')) {
    fs.copyFileSync(regSrc, path.join(tmpDir, 'kingdom_registry.txt'));
  }

  // Symlink FlameGraph tools if needed
  if (manifest.flamegraph) {
    const fgLink = path.join(tmpDir, 'FlameGraph');
    if (fs.existsSync(FLAMEGRAPH_DIR)) {
      fs.symlinkSync(FLAMEGRAPH_DIR, fgLink);
    }
  }

  return tmpDir;
}

function cleanupDir(dir) {
  try {
    fs.rmSync(dir, { recursive: true, force: true });
  } catch {}
}

const server = http.createServer((req, res) => {
  // CORS headers for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Health check
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', levels: Object.keys(LEVEL_FILES).length }));
    return;
  }

  res.writeHead(404);
  res.end('Not found');
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws, req) => {
  // Extract level ID from URL: ws://host:8080/level/1-1
  const urlParts = req.url?.split('/') || [];
  const levelId = urlParts[urlParts.length - 1] || '1-1';

  console.log(`[${new Date().toISOString()}] New connection for level ${levelId}`);

  // Setup clean directory for this level
  const sessionDir = setupLevelDir(levelId);
  console.log(`  Session dir: ${sessionDir}`);

  // Spawn a bash shell with a real PTY
  const shellEnv = {
    ...process.env,
    HOME: sessionDir,
    PS1: '\\[\\033[1;32m\\]student@perfquest\\[\\033[0m\\]:\\[\\033[1;34m\\]\\w\\[\\033[0m\\]$ ',
    PATH: `${sessionDir}/bin:${FLAMEGRAPH_DIR}:${process.env.PATH}`,
    TERM: 'xterm-256color',
    LEVEL: levelId,
  };

  const shell = pty.spawn('bash', ['--norc'], {
    name: 'xterm-256color',
    cols: 80,
    rows: 24,
    cwd: sessionDir,
    env: shellEnv,
  });

  // PTY → WebSocket
  shell.onData((data) => {
    if (ws.readyState === 1) ws.send(data);
  });

  shell.onExit(() => {
    console.log(`  Shell closed for level ${levelId}`);
    cleanupDir(sessionDir);
    ws.close();
  });

  // WebSocket → PTY
  ws.on('message', (data) => {
    const msg = data.toString();
    try {
      const parsed = JSON.parse(msg);
      if (parsed.type === 'resize') {
        shell.resize(parsed.cols, parsed.rows);
        return;
      }
    } catch {}

    shell.write(msg);
  });

  ws.on('close', () => {
    console.log(`  WebSocket closed for level ${levelId}`);
    shell.kill();
    cleanupDir(sessionDir);
  });

  ws.on('error', (err) => {
    console.error(`  WebSocket error: ${err.message}`);
    shell.kill();
    cleanupDir(sessionDir);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`PerfQuest Terminal Server running on ws://0.0.0.0:${PORT}`);
  console.log(`Levels configured: ${Object.keys(LEVEL_FILES).length}`);
  console.log(`Bin dir: ${BIN_DIR}`);
  console.log(`FlameGraph: ${FLAMEGRAPH_DIR}`);
});
