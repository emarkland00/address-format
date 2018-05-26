const http = require('http');

function LibPostalProxy() {
    this.host = 'postal_rest';
    this.port = 8080;
    this.path = '/parser';
    this.method = 'POST';
}

/**
 * Parses the input address into the libpostal engine
 * @param {string} address 
 */
LibPostalProxy.prototype.parse = function(address, callbackFn) {
    // make HTTP request to libpostal rest
    const postData = JSON.stringify({
        'query': address
    });

    // get response from client
    const options = {
        host: this.host,
        port: this.port,
        path: this.path,
        method: this.method,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const req = http.request(options, (res) => {
        var result = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
            result += chunk;
        });
        res.on('end', () => {
            callbackFn(result);
            console.log('No more data in response.');
        });
    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    // write data to request body
    req.write(postData);
    req.end();
}

exports.LibPostalProxy = LibPostalProxy;