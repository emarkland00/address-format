import chai from 'chai';

import apiRoutes from './api.route.js';

const assert = chai.assert;
const api = apiRoutes();

const mockRequest = ({ query=null, apiKey=null } = {}) => ({
    query: {
        query,
        apiKey
    }
});

describe('api/api.route', () => {
    describe('#requestIsValid', () => {
        it('throws error if incoming request is api key is null', done => {
            const requestWithNullApiKey = mockRequest({
                apiKey: null
            });
            const isRequestValid = api.requestIsValid(requestWithNullApiKey);
            assert.isFalse(isRequestValid);
            done();
        });
    });
});
