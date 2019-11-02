/**
 * Normalize a port into a number or string
 * @param {int|string} value - The port value to normalize
 * @return {int|string} The normalized port value or null if port value is invalid
 */
export function normalizePort(value) {
    if (!isValidType(value)) {
        return null;
    }

    if (isNamedPipe(value)) {
        return value;
    }

    const port = parseInt(value, 10);
    if (port !== value) {
        return null;
    }

    return isValidPortNumber(port) ? port : null;
}

const validTypes = [ 'number', 'string' ];
const isValidType = value => validTypes.some(type => type === typeof value);
const isNamedPipe = value => isNaN(value);
const isValidPortNumber = value => value >= 0 && value < 65536;
