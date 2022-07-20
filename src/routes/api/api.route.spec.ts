// imports needed for jest
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import express from 'express';
import { createApp } from '../../init-app';
import request from 'supertest';
import apiRouter from '../api/index';
import { constants } from './api.route';

import { AxiosResponse } from 'axios';

describe('api/api.route', () => {
    let app: any;

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
        const createMockClient = (addressComponentsObject = {}) => async () => {
            const response: AxiosResponse = {
                data: {
                    results: [
                        { components: addressComponentsObject }
                    ]
                },
                config: {},
                status: 0,
                statusText: '',
                headers: {}
            }
            return response;
        };

        const createMockApp = () => {
            const routerWithApiCredentialsConfigured = apiRouter(createMockClient());
            const mockApp = express();
            mockApp.use('/api', routerWithApiCredentialsConfigured);
            return mockApp;
        }

        it('throws an error if an empty query is passed in', async () => {            
            const response = await request(createMockApp()).get('/api/parse');
            expect(response.statusCode).toEqual(400);
            expect(response.body).toEqual({
                error: 400,
                message: constants.PARSE_ADDRESS_MISSING_QUERY
            });
        });

        it('parse the address if a non empty query is passed in', async () => {
            const response = await request(createMockApp()).get('/api/parse?query=123');
            expect(response.statusCode).toEqual(200);
            expect(response.body).toBeTruthy();
        });

        it('parses the address if valid query and supported iso code is passed in', async () => {
            const urlWithValidIsoCode = '/api/parse?query=123&iso=US';
            const response = await request(createMockApp()).get(urlWithValidIsoCode);
            expect(response.statusCode).toEqual(200);
            expect(response.body).toBeTruthy();
        });

        it('returns an empty address if valid query is passed in but invalid iso code is passed in', async () => {
            const response = await request(createMockApp()).get('/api/parse?query=123&iso=XX');
            expect(response.statusCode).toEqual(200);
            expect(response.body).toEqual({});
        });
    });
});
