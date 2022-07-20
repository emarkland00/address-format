import { NextFunction } from 'express';
import {
    getAddressFormatTemplate,
    parseAddressWithTemplate,
    isIsoSupported
} from '../../lib/address-format-parser';

export default (getApiCredentialsFn: () => any, apiClient: any) => {
    const constants = {
        ISO_CODE_MISSING: 'Please supply an ISO code',
        ISO_CODE_UNSUPPORTED: 'ISO code is unsupported',
        SERVER_NOT_CONFIGURED: 'Server not configured for parsing address',
        PARSE_ADDRESS_MISSING_QUERY: 'Missing query to parse an address',
    };

    /**
     * Gets the address format for the specified iso code
     * @param {*} req - The express request object
     * @param {*} res - The express response object
     * @param {*} next - The function to the next express middleware
     */
    function getAddressFormat(req: any, res: any, next: NextFunction) {
        const iso = req.query.iso;
        if (!iso) {
            res.status(400);
            res.json({
                error: 400,
                message: constants.ISO_CODE_MISSING
            });
            next();
            return;
        }

        if (!isIsoSupported(iso)) {
            res.status(400);
            res.json({
                error: 400,
                message: constants.ISO_CODE_UNSUPPORTED
            });
            next();
            return;
        }

        const addressFormatTemplate = getAddressFormatTemplate(iso);
        res.status(200);
        res.json(addressFormatTemplate);
        return next();
    }

    /**
     * Parse an address into components
     * @param {*} req - The express request object
     * @param {*} res - The express response object
     * @param {*} next - The function to the next express middleware
     */
    function parseAddress(req: any, res: any, next: NextFunction) {
        const creds = getApiCredentialsFn();
        if (!creds) {
            res.status(500);
            res.send({
                error: 500,
                message: constants.SERVER_NOT_CONFIGURED
            });
            next();
            return;
        }

        const { apiKey } = creds;
        if (!apiKey) {
            res.status(500);
            res.send({
                error: 500,
                message: constants.SERVER_NOT_CONFIGURED
            });
            next();
            return;
        }

        if (!req.query.query) {
            res.status(400);
            res.json({
                error: 400,
                message: constants.PARSE_ADDRESS_MISSING_QUERY
            });
            next();
            return;
        }

        const { query, iso='US' } = req.query;
        apiClient(query)
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
    function handleResponse(iso: string, res: any, next: NextFunction): {(r:any): void} {
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
    function handleError(res: any, next: NextFunction): { (r:any): void} {
        return err => {
            res.status(500);
            res.json({
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
    function normalizeGeocageAddress(addressComponents: any) {
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
        constants,
        getAddressFormat,
        parseAddress
    };
}