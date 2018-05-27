const format = require("string-template");

function AddressFormatParser() {
    populateISOMap();
}

// address parts
const title = "<title>";
const honorific = "<honorific>";
const firstName = "<firstName>";
const middleName = "<middleName>";
const lastName = "<lastName>";
const secondLastName = "<secondLastName>";
const companyName = "<companyName>";
const streetNumber = "<streetNumber>";
const streetName = "<streetName>";
const address1 = "<address1>";
const address2 = "<address2>";
const apartmentNumber = "<apartmentNumber>";
const city = "<city>";
const state = "<state>";
const postalCode = "<postalCode>";
const country = "<country>";
const countryCode = "<countryCode>";
const countryAbbreviation = "<countryAbbreviation>";
const province = "<province>";
const prefecture = "<prefecture>";
const jobTitle = "<jobTitle>";
const region = "<region>";
const blankLine = "<blankLine>";

const regexLessThan = /\[?</g;
const regexGreaterThan = />\]?/g;

/**
* Mark the address part as optional
* @param addressPart {string} - The address to mark
* @returns {string} The optional address part
**/
function optionalPart(addressPart) {
    return "[" + addressPart + "]";
}

/**
* Replace template key prefix/postfix with curly braces
* @param val {string} - The template key to format
* @returns {string} - The updated template key
**/
function templateKeyAsCurlyBrace(val) {
    if (!val) return val;
    return val.replace(regexLessThan, "").replace(regexGreaterThan, "");
}

/**
* Get the corresponding home address format
* @param iso {string} - The country ISO code
* @returns {json} - The address format for the specified country
*
**/
AddressFormatParser.prototype.getTemplate = function(iso) {
    let addressFormat = {};
    if (!iso || !this.isISOSupported(iso)) return addressFormat;

    // render the selected address format as json
    let addressMatrix = ISO_MAP[iso].format;
    for (let i = 0; i < addressMatrix.length; i++) {
        addressFormat["line_" + (i+1)] = addressMatrix[i].join(" ");
    }
    return addressFormat;
};

/**
* Parse the address as the specified country
* @param address {string} - The raw address string-template
* @param iso {string} - The country to parse the address as
* @returns {json} - The parsed address format
**/
AddressFormatParser.prototype.parseRawAddress = function(address, iso) {
    if (!this.isISOSupported(iso)) return null;

    //TODO: Add more extensive support and relations from US address address to other country address formats
    let p = parseAddress.parseAddress(address);
    if (!p) return null;

    let line1 = [ p.number, p.prefix, p.street, p.type ];
    if (p.sec_unit_type && p.sec_unit_num) { // check for apartment stuff
        line1[line1.length-1] += ",";
        line1.push(p.sec_unit_type);
        line1.push(p.sec_unit_num);
    }

    let result = {};
    result[templateKeyAsCurlyBrace(address1)] = line1.join(" ").replace(/\s{2,}/g, " ");
    result[templateKeyAsCurlyBrace(city)] = p.city + (p.state ? "," : "");
    result[templateKeyAsCurlyBrace(postalCode)] = p.zip;
    result[templateKeyAsCurlyBrace(state)] = p.state;
    return parseTemplate(this.getTemplate(iso), result);
};

/**
 * Parse address, matching the specified country
 * @param {addressFormatOpts} addressFormatOpts - The address format objects
 * @param {*} iso - The country code to show the address as
 */
AddressFormatParser.prototype.parseAddress = function(addressFormatOpts, iso) {
    if (!this.isISOSupported(iso)) return null;
    var opts = {};
    for (var key in addressFormatOpts) {
        var templateKey = templateKeyAsCurlyBrace(key);
        var val = addressFormatOpts[key];
        opts[templateKey] = val;
    }
    return parseTemplate(this.getTemplate(iso), opts);   
}

/**
* Parse the template using specified values
* @param template {json} - The address format template
* @param values {json} - The values to places into the template
* @returns {json} - The parsed template
**/
function parseTemplate(template, values) {
    let result = {};
    let i = 1;
    for (let line in template) {
        let formatString =  template[line].replace(regexLessThan, "{").replace(regexGreaterThan, "}");
        let parsed = format(formatString, values).trim();
        if (!parsed) continue;

        result["line_" + i] = parsed;
        i++;
    }
    return result;
}

let ISO_MAP = null;

/**
* Populates the ISO map
*/
function populateISOMap() {
    if (ISO_MAP) return;

    ISO_MAP = {};
    function addISO(code, name, addressFormatOrRelatedISO) {
        let format = addressFormatOrRelatedISO;
        if (typeof addressFormatOrRelatedISO === "string") {
            let relatedCountry = ISO_MAP[addressFormatOrRelatedISO];
            if (relatedCountry) {
                format = relatedCountry.format;
            }
        } else if (!Array.isArray(addressFormatOrRelatedISO)){
            format = null;
        }

        if (!format) return;
        ISO_MAP[code] = { code: code, name: name, format: format };
    }

    addISO("AU", "Australia", [
        [ honorific, firstName, middleName, lastName ],
        [ address1 ],
        [ optionalPart(address2) ],
        [ city, state, postalCode ],
        [ optionalPart(country) ],
    ]);
    addISO("US", "United States", "AU");

    addISO("BR", "Brazil", [
        [ optionalPart(companyName) ],
        [ honorific, firstName, middleName, lastName ],
        [ address1 ],
        [ postalCode, city, state ],
        [ optionalPart(country) ]
    ]);

    addISO("BG", "Bulgaria", [
        [ optionalPart(country) ],
        [ state ],
        [ postalCode, city ],
        [ address1 ],
        [ address2 ],
        [ optionalPart(companyName) ],
        [ honorific, firstName, middleName, lastName ]
    ]);

    addISO("CA", "Canada", [
        [ honorific, firstName, lastName ],
        [ optionalPart(companyName) ],
        [ address1 ],
        [ city, province, postalCode ],
        [ optionalPart(country) ]
    ]);

    addISO("CN", "China", [
        [ optionalPart(country) ],
        [ province, city ],
        [ address1 ],
        [ lastName, firstName, honorific ]
    ]);

    addISO("HR", "Croatia", [
        [ honorific, firstName, middleName, lastName ],
        [ streetNumber, streetNumber ],
        [ apartmentNumber ],
        [ postalCode, city ],
        [ state ],
        [ optionalPart(countryCode), postalCode, city ],
        [ optionalPart(country) ]
    ]);
    addISO("CZ", "Czech Republic", "HR");
    addISO("CS", "Serbia", "HR");
    addISO("SI", "Slovenia", "HR");

    addISO("DK", "Denmark", [
        [ optionalPart(honorific + " " + title), firstName, optionalPart(middleName), lastName ],
        [ optionalPart(companyName) ],
        [ address1 ],
        [ address2 ],
        [ optionalPart(countryCode) ],
    ]);

    addISO("FI", "Finland", [
        [ optionalPart(title), firstName, optionalPart(middleName), lastName ],
        [ optionalPart(companyName) ],
        [ address1 ],
        [ address2 ],
        [ postalCode, city ],
        [ optionalPart(country) ],
    ]);

    addISO("FR", "France", [
        [ honorific, firstName, lastName ],
        [ optionalPart(companyName) ],
        [ address1 ],
        [ address2 ],
        [ postalCode, city ],
        [ optionalPart(country) ]
    ]);

    addISO("DE", "Germany", [
        [ optionalPart(companyName) ],
        [ honorific, optionalPart(title), firstName, lastName ],
        [ address1 ],
        [ address2 ],
        [ blankLine ],
        [ optionalPart(country), postalCode, city ]
    ]);

    addISO("GR", "Greece", [
        [ optionalPart(title), firstName, optionalPart(middleName), lastName ],
        [ companyName ],
        [ address1 ],
        [ address2 ],
        [ postalCode, city ],
        [ optionalPart(country) ]
    ]);
    addISO("HU", "Hungary", [
        [ honorific, lastName, firstName ],
        [ city ],
        [ address1 ],
        [ postalCode ],
        [ state ],
        [ optionalPart(country) ]
    ]);

    addISO("IT", "Italy", [
        [ title, firstName, lastName ],
        [ optionalPart(companyName) ],
        [ address1 ],
        [ blankLine ],
        [ optionalPart(countryAbbreviation), postalCode, city, province ],
        [ optionalPart(country) ]
    ]);

    addISO("JP", "Japan", [
        [ optionalPart(country) ],
        [ postalCode, prefecture, city ],
        [ address1 ],
        [ companyName ],
        [ lastName, firstName, honorific ]
    ]);

    addISO("KR", "Korea", [
        [ optionalPart(country) ],
        [ postalCode ],
        [ province, city, address1 ], // province = do, city = si, address1 = <dong> <gu> <Address#>
        [ companyName ],
        [ lastName, firstName, honorific ]
    ]);

    addISO("MY", "Malaysia", [
        [ honorific, firstName, middleName, lastName ],
        [ optionalPart(companyName) ],
        [ address1 ],
        [ address2 ],
        [ postalCode, city ],
        [ state, optionalPart(country) ]
    ]);

    addISO("NL", "Netherlands", [
        [ title, firstName, middleName, lastName ],
        [ optionalPart(companyName) ],
        [ address1 ],
        [ address2 ],
        [ postalCode, city],
        [ optionalPart(country) ]
    ]);

    addISO("NO", "Norway", [
        [ optionalPart(jobTitle), firstName, lastName ],
        [ address1 ],
        [ postalCode, city ],
        [ optionalPart(country) ]
    ]);

    addISO("PL", "Poland", [
        [ optionalPart(country) ],
        [ postalCode ],
        [ optionalPart(state), optionalPart(region), city ],
        [ address1 ],
        [ address2 ],
        [ optionalPart(companyName) ],
        [ lastName ],
        [ firstName, middleName ]
    ]);
    addISO("RU", "Russia", "PL");

    addISO("PT", "Portugal", [
        [ honorific, firstName, middleName, lastName ],
        [ optionalPart(companyName) ],
        [ address1 ],
        [ address2 ],
        [ city ],
        [ postalCode ],
        [ optionalPart(countryCode) ]
    ]);

    addISO("RO", "Romania", [
        [ honorific, firstName, middleName, lastName ],
        [ optionalPart(companyName) ],
        [ address1 ],
        [ address2 ],
        [ postalCode, city ],
        [ state ],
        [ optionalPart(country) ]
    ]);

    addISO("ES", "Spain", [
        [ honorific, firstName, middleName, lastName ],
        [ secondLastName ],
        [ optionalPart(companyName) ],
        [ address1 ],
        [ postalCode, city ],
        [ optionalPart(country) ]
    ]);

    addISO("SE", "Sweden", [
        [ optionalPart(jobTitle), firstName, lastName ],
        [ address1 ],
        [ postalCode, city ],
        [ optionalPart(country) ]
    ]);

    addISO("CH", "Switzerland", [
        [ honorific, firstName, lastName ],
        [ address1 ],
        [ postalCode, city ],
        [ optionalPart(country) ]
    ]);

    addISO("TR", "Turkey", [
        [ honorific, firstName, middleName, lastName ],
        [ optionalPart(companyName) ],
        [ address1 ],
        [ address2 ],
        [ postalCode, city ],
        [ optionalPart(country) ]
    ]);
}

/**
* Checks whether if ISO code is supported
*
* List of supported address formats https://msdn.microsoft.com/en-us/library/cc195167.aspx
* May add more from http://www.bitboost.com/ref/international-address-formats.html#Formats
*/
AddressFormatParser.prototype.isISOSupported = function(iso) {
    return !!ISO_MAP[iso];
};

exports.AddressFormatParser = AddressFormatParser;
