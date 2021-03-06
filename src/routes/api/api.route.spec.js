// imports needed for jest
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import express from 'express';
import { createApp } from '../../init-app';
import request from 'supertest';
import apiRouter from '../api/index';
import apiRoutes from './api.route';

const { constants } = apiRoutes(() => {});

describe('api/api.route', () => {
    let app;

    beforeEach(async () => {
        app = createApp(3000);
    });

    describe('#getAddressFormat', () => {
        it('returns 400 if no iso code is passed in', async () => {
            const response = await request(app).get('/api/format');
            expect(response.statusCode).toEqual(400);
            expect(response.body).toEqual({
                error: 400,
                message: constants.ISO_CODE_MISSING
            });
        });

        it('returns 400 if unsupported iso code is passed in', async () => {
            const response = await request(app).get('/api/format?iso=??');
            expect(response.statusCode).toEqual(400);
            expect(response.body).toEqual({
                error: 400,
                message: constants.ISO_CODE_UNSUPPORTED
            });
        });

        it('returns 200 if supported iso code is passed in', async () => {
            const response = await request(app).get('/api/format?iso=US');
            expect(response.statusCode).toEqual(200);
            expect(response.body).toBeTruthy();
        });
    });

    describe('#parseAddress', () => {
        const createMockApiClient = (addressComponentsObject = {}) => async () => ({
            data: {
                results: [
                    { components: addressComponentsObject }
                ]
            }
        });

        const createMockApiCredentialsFetcher = (apiKey = null) => () => ({ apiKey });

        it('throws an error if the env is not set up an API key', async () => {
            const routerWithNoApiCredentialsConfigured = apiRouter(createMockApiCredentialsFetcher(null));
            const mockApp = express();
            mockApp.use('/api', routerWithNoApiCredentialsConfigured);

            const response = await request(mockApp).get('/api/parse');
            expect(response.statusCode).toEqual(500);
            expect(response.body).toEqual({
                error: 500,
                message: constants.SERVER_NOT_CONFIGURED
            });
        });

        it('throws an error if an empty query is passed in', async () => {
            const routerWithApiCredentialsConfigured = apiRouter(createMockApiCredentialsFetcher('test_key'));
            const mockApp = express();
            mockApp.use('/api', routerWithApiCredentialsConfigured);

            const response = await request(mockApp).get('/api/parse');
            expect(response.statusCode).toEqual(400);
            expect(response.body).toEqual({
                error: 400,
                message: constants.PARSE_ADDRESS_MISSING_QUERY
            });
        });

        it('parse the address if a non empty query is passed in', async () => {
            const mockApiClient = createMockApiClient({ state_code: 'ZZ' });
            const mockFetchCreds = createMockApiCredentialsFetcher('test_key');

            const routerWithApiCredentialsConfigured = apiRouter(mockFetchCreds, mockApiClient);
            const mockApp = express();
            mockApp.use('/api', routerWithApiCredentialsConfigured);

            const response = await request(mockApp).get('/api/parse?query=123');
            expect(response.statusCode).toEqual(200);
            expect(response.body).toBeTruthy();
        });

        it('parses the address if valid query and supported iso code is passed in', async () => {
            const mockApiClient = createMockApiClient({ state_code: 'ZZ' });
            const mockFetchCreds = createMockApiCredentialsFetcher('test_key');

            const routerWithApiCredentialsConfigured = apiRouter(mockFetchCreds, mockApiClient);
            const mockApp = express();
            mockApp.use('/api', routerWithApiCredentialsConfigured);

            const urlWithValidIsoCode = '/api/parse?query=123&iso=US';
            const response = await request(mockApp).get(urlWithValidIsoCode);
            expect(response.statusCode).toEqual(200);
            expect(response.body).toBeTruthy();
        });

        it('returns an empty address if valid query is passed in but invalid iso code is passed in', async () => {
            const mockApiClient = createMockApiClient({ state_code: 'ZZ' });
            const mockFetchCreds = createMockApiCredentialsFetcher('test_key');

            const routerWithApiCredentialsConfigured = apiRouter(mockFetchCreds, mockApiClient);
            const mockApp = express();
            mockApp.use('/api', routerWithApiCredentialsConfigured);

            const response = await request(mockApp).get('/api/parse?query=123&iso=XX');
            expect(response.statusCode).toEqual(200);
            expect(response.body).toBeFalsy();
        });
    });
});
