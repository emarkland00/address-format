// imports needed for jest
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import app from '../../app';
import request from 'supertest';
import { constants, getApiCredentials } from './api.route';

// jest.spyOn(routes, 'getApiCredentials').mockReturnValue({});
jest.mock('getApiCredentials', () => {});

describe('api/api.route', () => {
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
        it('throws an error if the env is not set up an API key', async () => {
            

            const response = await request(app).get('/api/parse');
            expect(response.statusCode).toEqual(500);
            expect(response.body).toEqual({
                error: 500,
                message: constants.SERVER_NOT_CONFIGURED
            });
        });

        /*
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
                    message: constants.PARSE_ADDRESS_MISSING_QUERY
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
