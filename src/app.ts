// enable loading from process.ENV
import dotenv from 'dotenv';
dotenv.config();

import { createAppServer } from './init-app';
const port = process.env.PORT || 3000;
const shutdownAppServer = createAppServer(port);
process.on('SIGINT', shutdownAppServer);
