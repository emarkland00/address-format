import { Router } from 'express';
import apiRoutes from './api.route';

export default (getApiCredentialsFn: any, apiClient: any) => {
    const router = Router();
    const routes = apiRoutes(getApiCredentialsFn, apiClient);
    router.get('/format', routes.getAddressFormat);
    router.get('/parse', routes.parseAddress);

    return router;
};


