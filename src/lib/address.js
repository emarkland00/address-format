const format = require("string-template");
const isoMap = require("./isoMap");
import * as constants from '.constants';
import parseAddressParser from '.parseAddressParser';

function AddressParser() { /*nothing*/ }

/**
* Get the corresponding home address format
* @param {string} iso - The constants.COUNTRY ISO code
* @returns {json} - The address format for the specified constants.COUNTRY
*
**/
AddressParser.prototype.getFormat = function(iso) {
    let addressFormat = {};
    if (!iso || !isoMap.isISOSupported(iso)) return addressFormat;

    // render the selected address format as json
    let addressMatrix = isoMap.getISOFormat(iso).format;
    for (let i = 0; i < addressMatrix.length; i++) {
        addressFormat[`line_${i+1}`] = addressMatrix[i].map(part => `<${part}>`).join(" ");
    }
    return addressFormat;
};

/**
* Parse the address as the specified constants.COUNTRY
* @param {string} address - The raw address string-template
* @param {string} iso - The constants.COUNTRY to parse the address as
* @returns {json} - The parsed address format
**/
AddressParser.prototype.parseRawAddress = function(address, iso) {
    if (!isoMap.isISOSupported(iso)) return null;

    // this method should be a generic address parser that parses
    // an address to a intermediary format
    let p = parseAddressParser(address);

    return parseTemplate(isoMap.getISOFormat(iso), result);
};

/**
* Parse the template using specified values
* @param {json} template - The address format template
* @param {json} values - The values to places into the template
* @returns {json} - The parsed template
**/
function parseTemplate(template, values) {
    let result = {};
    let i = 1;
    for (let line in template) {
        let formatString =  template[line].replace(constants.REGEX_LESS_THAN, "{").replace(constants.REGEX_GREATER_THAN, "}");
        let parsed = format(formatString, values).trim();
        if (!parsed) continue;

        result["line_" + i] = parsed;
        i++;
    }
    return result;
}

/**
* Mark the address part as optional
* @param {string} addressPart - The address to mark
* @returns {string} The optional address part
**/
function optionalPart(addressPart) {
    return "[" + addressPart + "]";
}

/**
* Replace template key prefix/postfix with curly braces
* @param {string} val - The template key to format
* @returns {string} - The updated template key
**/
function templateKeyAsCurlyBrace(val) {
    if (!val) return val;
    return val.replace(constants.REGEX_LESS_THAN, "").replace(constants.REGEX_GREATER_THAN, "");
}

exports.AddressParser = AddressParser;