import { Router } from 'express';
import { GeoCageApiServiceClient } from '../../services/geocage-api-service';
import { getAddressFormat, parseAddress } from './api.route';

export default (apiClient: GeoCageApiServiceClient) => {
    const router = Router();
    router.get('/format', getAddressFormat);
    router.get('/parse', parseAddress(apiClient));

    return router;
};