const http = require('http');
const addressFormatOpts = require('../lib/address-format-object');

function LibPostalProxy(json) {
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
            result += chunk;
        });
        res.on('end', () => {
            var opts = parseJsonToAddressFormatOpts(result);
            callbackFn(opts);
        });
    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    // write data to request body
    req.write(postData);
    req.end();
}

function parseJsonToAddressFormatOpts(rawJson) {
    // parse libpostal results
    var jArr = JSON.parse(rawJson);
    
    var json = {}
    for (var i = 0; i < jArr.length; i++) {
        var obj = jArr[i];
        var label = obj['label'];
        var value = obj['value'];
        json[label] = value;
    }

    var opts = {
        reference: json
    }
    // map to intermediary address format
    var mapper = addressFormatPropertyMapper(json);
    for (var key in mapper) {
        var val = mapper[key]();
        if (val) {
            opts[key] = val;
        }
    }
    
    return addressFormatOpts.AddressFormatOptions(opts);
}

/**
 * Map libpostal properties to intermediary format
 * @param {object} json - The json from libpostal
 * @returns {object} The json of properties to mapper functions
 */
function addressFormatPropertyMapper(json) {
    return {
        streetNumber: function() {
            return json.house_number || null;
        },
        streetName: function() {
            return json.road || null;
        },
        address1: function() {
            var addr = []
            if (json.house_number && json.road) {
                addr.push(json.house_number + ' ' + json.road);
            } else if (json.road) {
                addr.push(json.road);
            }

            if (json.level) {
                addr.push(json.level);
            }
            if (json.unit) {
                addr.push(', ' + json.unit);
            }
            if (!addr.length) return null;
            return addr.join(' ');
        },
        address2: function() {
            var addr2 = [];
            if (json.staircase) {
                addr2.push('Staircase ' + json.staircase);
            }
            if (json.entrance) {
                addr2.push('Entrance ' + json.entrance);
            }
            if (!addr2.length) return null;
            return addr2.join(' ');
        },
        apartmentNumber: function() {
            return json.unit || null;
        },
        city: function() {
            var cityInfo = [];
            if (json.city) {
                cityInfo.push(json.city);
            }
            if (json.city_district) {
                cityInfo.push(json.city_district);
            }
            if (json.suburb) {
                cityInfo.push(json.suburb);
            }
            if (!cityInfo.length) return null;
            return cityInfo.join(' ');
        },
        state: function() {
            var stateInfo = [];
            if (json.state) {
                stateInfo.push(json.state);
            }
            if (json.state_district) {
                stateInfo.push(json.state_district);
            }
            if (!stateInfo.length) return null;
            return stateInfo.push(' ');
        },
        postalCode: function() {
            var postalInfo = []
            if (json.po_box) {
                postalInfo.push(json.po_box);
            }
            if (json.postcode) {
                postalInfo.push(json.postcode);
            }

            if (!postalInfo.length) return null;
            return postalInfo.join(' ');
        },
        country: function() {
            var countryInfo = []
            if (json.country) {
                countryInfo.push(json.country);
            }
            if (json.country_region) {
                countryInfo.push(json.country_region);
            }

            if (!countryInfo.length) return null;
            return countryInfo.join(' ');
        },
        countryCode: function() {
            return json.country || null;
        },
        countryAbbreviation: function() {
            return json.country || null;
        },
        province: function() {
            return json.country_region || null
        },
        prefecture: function() {
            return json.suburb || null
        },
        region: function() {
            return json.world_region
        }
    }
}

exports.LibPostalProxy = LibPostalProxy;