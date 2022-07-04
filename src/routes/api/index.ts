import { Router as router } from 'express';
import { handleResponseAsJson } from '../../middleware/handleResponseAsJson';
import apiRoutes from './api.route';

export default (getApiCredentialsFn: any, apiClient: any) => {
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


