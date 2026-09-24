import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import handler from './api/generate.js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  if (env.OPENROUTER_API_KEY) {
    process.env.OPENROUTER_API_KEY = env.OPENROUTER_API_KEY;
  }

  return {
    plugins: [
      react(),
      {
        name: 'api-generate-dev-middleware',
        configureServer(server) {
          server.middlewares.use('/api/generate', async (req, res) => {
            let bodyStr = '';
            req.on('data', (chunk) => {
              bodyStr += chunk;
            });
            req.on('end', async () => {
              try {
                req.body = JSON.parse(bodyStr || '{}');
              } catch (e) {
                req.body = {};
              }

              res.status = function (code) {
                res.statusCode = code;
                return res;
              };

              res.json = function (data) {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
                return res;
              };

              await handler(req, res);
            });
          });
        },
      },
    ],
  };
});
