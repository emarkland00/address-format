/**
 * Configures the HTTP response to be handled as a JSON response
 * @return {function} A middleware function that transforms the HTTP
 * response into a JSON content type response
 */
export function handleResponseAsJson() {
    return (_, res, next) => {
        res.set('Content-Type', 'application/json');
        next();
    };
}
