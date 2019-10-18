import { geocageApiService } from '../../services/geocage-api-service';
import { getAddressFormatTemplate } from '../../lib/address-format-parser';

export default () => {
    /**
     * Gets the address format for the specified iso code
     * @param {*} req - The express request object
     * @param {*} res - The express response object
     * @param {*} next - The function to the next express middleware
     */
    function getAddressFormat(req, res, next) {
        const iso = req.query.iso;
        if (!iso) {
            res.status(400).json({
                error: 400,
                message: 'Please supply an ISO code'
            });
        } else {
            const addressFormatTemplate = getAddressFormatTemplate(iso);
            res.send(addressFormatTemplate);
        }
        next();
    }

    /**
     * Parse an address into components
     * @param {*} req - The express request object
     * @param {*} res - The express response object
     * @param {*} next - The function to the next express middleware
     */
    function parseAddress(req, res, next) {
        if (!requestIsValid(req)) {
            res.status(400).json({
                error: 400,
                message: 'Need API key to use'
            });
            next();
            return;
        }

        const { apiKey, query } = req.query;
        geocageApiService({ apiKey })
            .forwardGeocode(query)
            .then(handleResponse(res, next))
            .catch(handleError(res, next));
    }

    /**
     * Checks that the API request is valid
     * @param {*} req - The express request object
     * @return {boolean} - True if the request is valid. False, if otherwise
     */
    function requestIsValid(req) {
        return !!req.query.apiKey && !!req.query.query;
    }

    /**
     * Handles the response from the API client
     * @param {*} res - The express response object
     * @param {*} next - The function to the next express middleware
     * @return {function} A function that takes a string and performs operations with it
     */
    function handleResponse(res, next) {
        return response => {
            const apiResponse = response.data;
            // May get multiple results so settle for first one
            const result = apiResponse.results[0];
            console.log(result.components);
            const normalized = normalizeGeocageAddress(result.components);
            res.send(normalized);
            next();
        };
    }

    /**
     * Handles the error generated from the API client
     * @param {*} res - The express response object
     * @param {*} next - The function to the next express middleware
     * @return {function} A function that handles the error object
     */
    function handleError(res, next) {
        return err => {
            res.status(500).json({
                error: 500,
                message: 'Unexpected problem occured trying to query API'
            });
            next(err);
        };
    }

    /**
     * Takes the geocage address representation and normalizes it
     * @param {object} addressComponents - The address components from the geocage api
     * @return {object} A normalized representation of the address components
     */
    function normalizeGeocageAddress(addressComponents) {
        const normalizedAddress = {
            address: `${addressComponents.house_number || ''} ${addressComponents.road || ''}`.trim(),
            city: addressComponents.city || addressComponents.suburb || addressComponents.county || addressComponents.town || '',
            state: addressComponents.state_code || '',
            countryCode: addressComponents['ISO_3166-1_alpha-2'] || '',
        };
        return normalizedAddress;
    }

    return {
        getAddressFormat,
        parseAddress,
        requestIsValid
    };
};
