import { Router as router } from 'express';
import { handleResponseAsJson } from '../../middleware/handleResponseAsJson';
import { getAddressFormat, parseAddress } from './api.route.js';

const apiRouter = router();

apiRouter.get(
    '/format',
    handleResponseAsJson,
    getAddressFormat
);

apiRouter.get(
    '/parse',
    handleResponseAsJson,
    parseAddress
);

export default apiRouter;
