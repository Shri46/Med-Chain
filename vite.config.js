import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KEYS_FILE = path.resolve(__dirname, 'keys.json');

function mockKeyServer() {
  return {
    name: 'mock-key-server',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/api/keys' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          if (fs.existsSync(KEYS_FILE)) {
            res.end(fs.readFileSync(KEYS_FILE));
          } else {
            res.end('{}');
          }
        } else if (req.url === '/api/keys' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', () => {
            try {
              const keys = JSON.parse(body);
              let existing = {};
              if (fs.existsSync(KEYS_FILE)) existing = JSON.parse(fs.readFileSync(KEYS_FILE, 'utf-8'));
              Object.assign(existing, keys);
              fs.writeFileSync(KEYS_FILE, JSON.stringify(existing, null, 2));
              res.end(JSON.stringify({ success: true }));
            } catch (e) { res.statusCode = 500; res.end(e.message); }
          });
        } else {
          next();
        }
      });
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mockKeyServer()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      process: "process/browser",
      stream: "stream-browserify",
      zlib: "browserify-zlib",
      util: "util",
      buffer: "buffer",
      events: "events",
    },
  },
  define: {
    'process.env': {},
    'global': 'window', // Polyfill global for IPFS client
  },
  optimizeDeps: {
    exclude: ['js-big-decimal']
  }
})
