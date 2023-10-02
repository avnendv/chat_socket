import express from 'express';
import http from 'http';
import { setupApp } from './plugins';
import { PORT } from './config/env';

const app = express();
const server = http.createServer(app);

setupApp(app, server);

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
