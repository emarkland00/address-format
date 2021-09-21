import { Router as router } from 'express';
import { handleResponseAsJson } from '../../middleware/handleResponseAsJson.js';
import apiRoutes from './api.route.js';

export default (getApiCredentialsFn, apiClient) => {
    const apiRouter = router();
    const routes = apiRoutes(getApiCredentialsFn, apiClient);
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

    return apiRouter;
};


