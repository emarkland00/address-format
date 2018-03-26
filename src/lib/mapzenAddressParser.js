const fs = require('fs');
const http = require('http');

let API_CREDENTIALS = null;
function loadAPICredentials(callback) {
    if (API_CREDENTIALS) return true;
    // TODO: Test that this actually works
    try {
        var contents = fs.readFileSync('../credentials.json', 'r');
        API_CREDENTIALS = JSON.parse(contents);
        return true;
    } catch (e) {
        console.log("Ran into problem reading file " + e)
    }

    return false;
}

AddressParser.prototype.parseRawAddressAPI = function(address, iso, callback) {
    if (!loadAPICredentials()) return;

    let path = "/parse?address=" + address;
    processRequest(API_CREDENTIALS.base_url, path, function (data) {
        var json = JSON.parse(data);

        // TODO: Map API results to your predefined constants
        // TODO: Take result and parse it with respect to specified constants.COUNTRY

        callback(json);
    });
}


/**
 *  Make a request to the third party client
 *  @param {string} path - The API path we wish to access
 *  @param {function} responseCallback - The function to run for a successfully request
 */
function processRequest(baseURL, path, responseCallback) {
    var opts = {
        hostname: baseURL,
        port: 80,
        path: path,
        headers: {
            'Content-type': 'application/json'
        }
    };

    var req = http.request(opts, (res) => {
        res.setEncoding('utf-8');
        res.on('data', responseCallback);
    });

    req.on('error', e => {
        console.log('Error occured with API request: ' + e.message);
    });

    req.end();
}