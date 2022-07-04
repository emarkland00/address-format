import axios from 'axios';

const API_URL_BASE = 'https://api.opencagedata.com';
const API_URL_PATH = '/geocode/v1/json';
const API_PARAM_LANGUAGE = 'en';

/**
 * An API client for the Geocage Address API
 * @param {string} apiKey - The API key for the Geocage API client
 * @return {object} An object containing all possible methods for interacting
 * with the Geocage API
 */
export function geocageApiService({ apiKey }: { apiKey: string }) {
    if (!apiKey) {
        throw Error('Must have an API key');
    }

    return {
        forwardGeocode: (query: any) => {
            if (!query) {
                throw Error('Must have a valid query');
            }

            const url = `${API_URL_BASE}${API_URL_PATH}?q=${query}&key=${apiKey}&language=${API_PARAM_LANGUAGE}`;
            return axios.get(url);
        }
    };
}
