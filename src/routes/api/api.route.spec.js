// imports needed for jest
import 'core-js';
import 'regenerator-runtime/runtime';

import chai from 'chai';
import request from 'supertest';

import app from '../../app';

import { default as apiRoutes } from './api.route.js';

const assert = chai.assert;


const routes = apiRoutes();

describe('api/api.route', () => {
    describe('#getAddressFormat', () => {
        it('returns 400 if no iso code is passed in', async () => {
            const res = await request(app).get('/api/format');
            expect(res.statusCode).toEqual(400);
            expect(res.body).toEqual({
                error: 400,
                message: routes.constants.ISO_CODE_MISSING
            });
        });

        /*
        it('returns 400 if unsupported iso code is passed in', done => {
            const requestWithUnsupportedIso = mockRequest({ iso: '??' });
            const response = mockResponse();
            const mockDone = () => {
                assert.isTrue(response.status.calledOnceWith(400));
                assert.isTrue(response.json.calledOnceWith({
                    error: 400,
                    message: routes.constants.ISO_CODE_UNSUPPORTED
                }));
                done();
            };
            routes.getAddressFormat(requestWithUnsupportedIso, response, mockDone);
        });

        it('returns 200 if supported iso code is passed in', done => {
            const requestWithSupportedIso = mockRequest({ iso: 'US' });
            const response = mockResponse();
            const mockDone = () => {
                assert.isTrue(response.status.calledOnceWith(200));
                assert.isTrue(response.json.calledOnce);
                done();
            };
            routes.getAddressFormat(requestWithSupportedIso, response, mockDone);
        });
        */
    });

    describe('#parseAddress', () => {
        /*
        it('throws an error if the env is not set up an API key', done => {
            sinon.stub(routes, 'getApiCredentials').returns({});

            const req = mockRequest();
            const res = mockResponse();
            const mockDone = () => {
                assert.isTrue(res.status.calledOnceWith(500));
                assert.isTrue(res.json.calledOnceWith({
                    error: 500,
                    message: routes.constants.SERVER_NOT_CONFIGURED
                }));
                sinon.restore();
                done();
            };

            routes.parseAddress(req, res, mockDone);
        });

        it('throws an error if an empty query is passed in', done => {
            const apiCredsStub = sinon.stub();
            sinon.stub(apiRoutes, 'getApiCredentials').callsFake(apiCredsStub);

            apiCredsStub.returns({ apiKey: 'test_value ' });

            const req = mockRequest();
            const res = mockResponse();
            const mockDone = () => {
                assert.isTrue(res.status.calledOnceWith(400));
                assert.isTrue(res.json.calledOnceWith({
                    error: 400,
                    message: routes.constants.PARSE_ADDRESS_MISSING_QUERY
                }));
                apiCredsStub.restore();
                done();
            };

            apiRoutes.parseAddress(req, res, mockDone);
        });

        it('parse the address if a non empty query is passed in', done => {
            assert.isTrue(false);
            done();
        });

        it('parses the address if valid query and supported iso code is passed in', done => {
            assert.isTrue(false);
            done();
        });

        it('returns an empty address if valid query is passed in but invalid iso code is passed in', done => {
            assert.isTrue(false);
            done();
        });*/
    });
});
