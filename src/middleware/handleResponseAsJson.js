/**
 * Handles the response as a json response
 * @param {*} req - The express request object
 * @param {*} res - The express response object
 * @param {*} next - The function to the next middleware
 */
export function handleResponseAsJson(req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    next();
}
