import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'save-json-db',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Decode URL to handle spaces and special characters
          const decodedUrl = decodeURIComponent(req.url || '');
          if (decodedUrl.startsWith('/Lectures/') || decodedUrl.startsWith('/Section/')) {
            const relativePath = decodedUrl.startsWith('/') ? decodedUrl.slice(1) : decodedUrl;
            const filePath = path.resolve(__dirname, '..', relativePath);
            if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
              res.writeHead(200, { 'Content-Type': 'application/pdf' });
              const fileStream = fs.createReadStream(filePath);
              fileStream.pipe(res);
              return;
            }
          }

          if (req.url === '/api/save' && req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk.toString();
            });
            req.on('end', () => {
              try {
                const { filename, data } = JSON.parse(body);
                // Whitelist database files to prevent arbitrary path traversal writes
                const allowedFiles = ['lectures.json', 'exercises.json', 'announcements.json'];
                if (allowedFiles.includes(filename)) {
                  const filePath = path.resolve(__dirname, 'src/data', filename);
                  
                  // Ensure parent directories exist
                  fs.mkdirSync(path.dirname(filePath), { recursive: true });
                  
                  // Write updated content formatted nicely
                  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
                  
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ success: true }));
                } else {
                  res.writeHead(400, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: 'Forbidden file update' }));
                }
              } catch (error: any) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: error.message }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: './', // Ensures relative assets work on GitHub Pages subpaths
});
