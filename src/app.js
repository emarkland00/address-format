import { createApp, startServer } from './init-app.js';
import { normalizePort } from './lib/net.js';

// enable loading from process.ENV
import dotenv from 'dotenv';
dotenv.config();

// execution script
const port = normalizePort(process.env.PORT || 3000);
const app = createApp(port);
const shutdownServer = startServer(app, port);
process.on('SIGINT', shutdownServer);

export default app;
