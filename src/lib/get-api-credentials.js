/**
 * Gets the API credentials from the environment
 * @return {object} An object containing the API credentials
 */
export function getApiCredentialsFromEnvironment() {
    return {
        apiKey: process.env.API_KEY
    };
}