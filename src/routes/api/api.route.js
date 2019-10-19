import { geocageApiService } from '../../services/geocage-api-service';
import { getAddressFormatTemplate, parseAddressWithTemplate } from '../../lib/address-format-parser';

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
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            res.status(500).json({
                error: 500,
                message: 'Server not configured for parsing address'
            });
        }
        if (!req.query.query) {
            res.status(400).json({
                error: 400,
                message: 'Need API and query key to use'
            });
            next();
            return;
        }

        const { query, iso='US' } = req.query;
        geocageApiService({ apiKey })
            .forwardGeocode(query)
            .then(handleResponse(iso, res, next))
            .catch(handleError(res, next));
    }

    /**
     * Handles the response from the API client
     * @param {string} iso - The country code to parse the address as
     * @param {*} res - The express response object
     * @param {*} next - The function to the next express middleware
     * @return {function} A function that takes a string and performs operations with it
     */
    function handleResponse(iso, res, next) {
        return response => {
            const apiResponse = response.data;
            // May get multiple results so settle for first one
            const result = apiResponse.results[0];
            const normalized = normalizeGeocageAddress(result.components);
            const parsed = parseAddressWithTemplate(normalized, iso);
            res.send(parsed);
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
            streetNumber: `${addressComponents.house_number || ''}`,
            streetName: addressComponents.road || '',
            address1: `${addressComponents.house_number || ''} ${addressComponents.road || ''}`.trim(),
            city: addressComponents.city || addressComponents.suburb || addressComponents.county || addressComponents.town || '',
            state: addressComponents.state_code || '',
            postalCode: addressComponents.postalCode || '',
            country: addressComponents.country || '',
            countryCode: addressComponents['ISO_3166-1_alpha-2'] || '',
            countryAbbreviation: addressComponents['ISO_3166-1_alpha-3'],
        };
        return normalizedAddress;
    }

    return {
        getAddressFormat,
        parseAddress
    };
};
