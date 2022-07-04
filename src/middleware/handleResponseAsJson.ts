/**
 * Handles the response as a json response
 * @param {*} req - The express request object
 * @param {*} res - The express response object
 * @param {*} next - The function to the next middleware
 */
export function handleResponseAsJson(req: any, res: { setHeader: (arg0: string, arg1: string) => void; }, next: () => void) {
    res.setHeader('Content-Type', 'application/json');
    next();
}
