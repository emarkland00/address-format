import express from 'express';
import { handleResponseAsJson } from '../../middleware/handleResponseAsJson';
import apiRoute from './api.route.js';

const apiRouteMethods = apiRoute();
const apiRouter = express.Router();
apiRouter.get('/api', handleResponseAsJson, apiRouteMethods.parseAddress);
export default apiRouter;
