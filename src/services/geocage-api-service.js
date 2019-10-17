const axios = require('axios');

const baseUrl = 'https://api.opencagedata.com';
const apiPath = '/geocode/v1/json';
const apiLanguage = 'en';

/**
 * An API client for the Geocage Address API
 * @param {string} apiKey - The API key for the Geocage API client 
 */
export function geocageApiService({ apiKey }) {
    if (!apiKey) {
        throw Error('Must have an API key');
    }

    return {
        forwardGeocode: query => {
            if (!query) {
                throw Error('Must have a valid query');
            }
        
            const url = `${baseUrl}${apiPath}?q=${query}key=${apiKey}&language=${apiLanguage}`;
            return axios.get(url);
        }
    };
}
