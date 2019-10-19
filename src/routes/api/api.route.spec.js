import chai from 'chai';

import apiRoutes from './api.route.js';

const assert = chai.assert;
const api = apiRoutes();

const mockRequest = ({ query=null, iso=null } = {}) => ({
    query: {
        query,
        iso        
    }
});

describe('api/api.route', () => {
    describe('#getAddressFormat', () => {
        it('throws error if iso code is not supplied', done => {
            const requestWithoutIsoCode = mockRequest();
            const response = null; // hook up sinon and get the spy going
            const mockDone = _ => {};
            assert.throws(api.getAddressFormat(requestWithoutIsoCode, response, mockDone));
            done();
        });

        it('returns a non-empty response if a supported iso is passed in', done => {
            assert.isTrue(false);
            done();
        });

        it('returns an empty response if an unsupported iso code is psased in', done => {
            assert.isTrue(false);
            done();
        });
    });

    describe('#parseAddress', () => {
        it('throws an error if the env is not set up an API key', done => {
            assert.isTrue(false);
            done();
        });

        it('throws an error if an empty query is passed in', done => {
            assert.isTrue(false);
            done();
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
        });
    });
});
