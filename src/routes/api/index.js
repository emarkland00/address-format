import { Router as router } from 'express';
import { handleResponseAsJson } from '../../middleware/handleResponseAsJson';
import apiRoutes from './api.route.js';

const routes = apiRoutes();
const apiRouter = router();

apiRouter.get(
    '/format',
    handleResponseAsJson,
    routes.getAddressFormat
);

apiRouter.get(
    '/parse',
    handleResponseAsJson,
    routes.parseAddress
);
export default apiRouter;
