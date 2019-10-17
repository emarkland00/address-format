import express from 'express';
import { handleResponseAsJson } from '../middleware/handleResponseAsJson';
import { parseAddress } from './api.route.js';

const apiRouter = express.Router();
apiRouter.get('/api', handleResponseAsJson, parseAddress);
export default apiRouter;
