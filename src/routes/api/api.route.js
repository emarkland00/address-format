import { geocageApiService } from '../../services/geocage-api-service';

export default () => {
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
            .then(handleResponse)
            .catch(handleError);
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
            const normalized = {
                ...response
            };
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
            console.log('Problem occured trying to get data from API', err);
            res.status(500).json({
                error: 500,
                message: 'Unexpected problem occured trying to query API'
            });
            next(err);
        };
    }

    return {
        parseAddress,
        requestIsValid
    };
};
