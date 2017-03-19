const parseAddress = require('parse-address');
const format = require('string-template');

function AddressParser() {
    populateISOMap();
}

// address parts
const title = "<title>";
const honorific = "<honorific>";
const firstName = "<first_name>";
const middleName = "<middle_name>";
const lastName = "<last_name>";
const secondLastName = "<second_last_name>";
const companyName = "<company_name>";
const streetNumber = "<street_number>";
const streetName = "<street_name>";
const address1 = "<address1>";
const address2 = "<address2>";
const apartmentNumber = "<apartment_number>";
const city = "<city>";
const state = "<state>";
const postalCode = "<postal_code>";
const country = "<country>";
const countryCode = "<country_code>";
const countryAbbreviation = "<country_abbreviation>";
const province = "<province>";
const prefecture = "<prefecture>";
const jobTitle = "<job_title>";
const region = "<region>";
const blankLine = "<blank_line>";

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
* List of supported address formats https://msdn.microsoft.com/en-us/library/cc195167.aspx
* May add more from http://www.bitboost.com/ref/international-address-formats.html#Formats
**/
AddressParser.prototype.getFormat = function(iso) {
    var addressMatrix = [];
    switch (iso.toUpperCase()) {
        case "AU": // Australia
        case "US": // United States
            addressMatrix = [
                [ honorific, firstName, middleName, lastName ],
                [ address1 ],
                [ optionalPart(address2) ],
                [ city, state, postalCode ],
                [ optionalPart(country) ],
            ];
            break;

        case "BR": // Brazil
            addressMatrix = [
                [ optionalPart(companyName) ],
                [ honorific, firstName, middleName, lastName ],
                [ address1 ],
                [ postalCode, city, state ],
                [ optionalPart(country) ]
            ];
            break;

        case "BG": // Bulgaria
            addressMatrix = [
                [ optionalPart(country) ],
                [ state ],
                [ postalCode, city ],
                [ address1 ],
                [ address2 ],
                [ optionalPart(companyName) ],
                [ honorific, firstName, middleName, lastName ]
            ];
            break;

        case "CA": // Canada
            addressMatrix = [
                [ honorific, firstName, lastName ],
                [ optionalPart(companyName) ],
                [ address1 ],
                [ city, province, postalCode ],
                [ optionalPart(country) ]
            ];
            break;

        case "CN": // China
            addressMatrix = [
                [ optionalPart(country) ],
                [ province, city ],
                [ address1 ],
                [ lastName, firstName, honorific ]
            ];
            break;

        case "HR": // Croatia
        case "CS": // Serbia
        case "SI": // Slovenia
        case "CZ": // Czech Republic
            addressMatrix = [
                [ honorific, firstName, middleName, lastName ],
                [ streetNumber, streetNumber ],
                [ apartmentNumber ],
                [ postalCode, city ],
                [ state ],
                [ optionalPart(countryCode), postalCode, city ],
                [ optionalPart(country) ]
            ];
            break;

        case "DK": // Denmark
            addressMatrix = [
                [ optionalPart(honorific + ' ' + title), firstName, optionalPart(middleName), lastName ],
                [ optionalPart(companyName) ],
                [ address1 ],
                [ address2 ],
                [ optionalPart(countryCode) ],
            ];
            break;

        case "FI": // Finland
            addressMatrix = [
                [ optionalPart(title), firstName, optionalPart(middleName), lastName ],
                [ optionalPart(companyName) ],
                [ address1 ],
                [ address2 ],
                [ postalCode, city ],
                [ optionalPart(country) ],
            ];
            break;

        case "FR": // France
            addressMatrix = [
                [ honorific, firstName, lastName ],
                [ optionalPart(companyName) ],
                [ address1 ],
                [ address2 ],
                [ postalCode, city ],
                [ optionalPart(country) ]
            ];
            break;

        case "GR": // Greece
            addressMatrix = [
                [ optionalPart(title), firstName, optionalPart(middleName), lastName ],
                [ companyName ],
                [ address1 ],
                [ address2 ],
                [ postalCode, city ],
                [ optionalPart(country) ]
            ];
            break;

        case "HU": // Hungary
            addressMatrix = [
                [ honorific, lastName, firstName ],
                [ city ],
                [ address1 ],
                [ postalCode ],
                [ state ],
                [ optionalPart(country) ]
            ];
            break;

        case "IT": // Italy
            addressMatrix = [
                [ title, firstName, lastName ],
                [ optionalPart(companyName) ],
                [ address ],
                [ blankLine ],
                [ optionalPart(countryAbbreviation), postalCode, city, province ],
                [ optionalPart(country) ]
            ];
            break;

        case "JP": // Japan
            addressMatrix = [
                [ optionalPart(country) ],
                [ postalCode, prefecture, city ],
                [ address1 ],
                [ companyName ],
                [ lastName, firstName, honorific ]
            ];
            break;

        case "KR": // Korea
            addressMatrix = [
                [ optionalPart(country) ],
                [ postalCode ],
                [ province, city, address1 ], // province = do, city = si, address1 = <dong> <gu> <Address#>
                [ companyName ],
                [ lastName, firstName, honorific ]
            ];
            break;

        case "MY": // Malaysia
            addressMatrix = [
                [ honorific, firstName, middleName, lastName ],
                [ optionalPart(companyName) ],
                [ address1 ],
                [ address2 ],
                [ postalCode, city ],
                [ state, optionalPart(country) ]
            ];
            break;

        case "NL": // Netherlands
            addressMatrix = [
                [ title, firstName, middleName, lastName ],
                [ optionalPart(companyName) ],
                [ address1 ],
                [ address2 ],
                [ postalCode, city],
                [ optionalPart(country) ]
            ];
            break;

        case "NO": // Norway
            addressMatrix = [
                [ optionalPart(jobTitle), firstName, lastName ],
                [ address1 ],
                [ postalCode, city ],
                [ optionalPart(country) ]
            ];
            break;

        case "PL": // Poland
        case "RO": // Russia
            addressMatrix = [
                [ honorific, firstName, middleName, lastName ],
                [ optionalPart(companyName) ],
                [ address1 ],
                [ address2 ],
                [ postalCode, city ],
                [ state ],
                [ optionalPart(country) ]
            ];
            break;

        case "PT": // Portugal
            addressMatrix = [
                [ honorific, firstName, middleName, lastName ],
                [ optionalPart(companyName) ],
                [ address1 ],
                [ address2 ],
                [ city ],
                [ postalCode ],
                [ optionalPart(countryCode) ]
            ];
            break;

        case "RU": // Russia
            addressMatrix = [
                [ optionalPart(country) ],
                [ postalCode ],
                [ optionalPart(state), optionalPart(region), city ],
                [ address1 ],
                [ address2 ],
                [ optionalPart(companyName) ],
                [ lastName ],
                [ firstName, middleName ]
            ];
            break;

        case "ES": // Spain
            addressMatrix = [
                [ honorific, firstName, middleName, lastName ],
                [ secondLastName ],
                [ optionalPart(companyName) ],
                [ address ],
                [ postalCode, city ],
                [ optionalPart(country) ]
            ];
            break;

        case "SE": // Sweden
            addressMatrix = [
                [ optionalPart(jobTitle), firstName, lastName ],
                [ address1 ],
                [ postalCode, city ],
                [ optionalPart(country) ]
            ];
            break;

        case "CH": // Switzerland
            addressMatrix = [
                [ honorific, firstName, lastName ],
                [ address1 ],
                [ postalCode, city ],
                [ optionalPart(country) ]
            ];
            break;

        case "TR": // Turkey
            addressMatrix = [
                [ honorific, firstName, middleName, lastName ],
                [ optionalPart(companyName) ],
                [ address1 ],
                [ address2 ],
                [ postalCode, city ],
                [ optionalPart(country) ]
            ];
            break;
    }

    // render the selected address format as json
    var addressFormat = {};
    for (var i = 0; i < addressMatrix.length; i++) {
        addressFormat["line_" + (i+1)] = addressMatrix[i].join(" ");
    }
    return addressFormat;
}

/**
* Parse the address as the specified country
* @param address {string} - The raw address string-template
* @param iso {string} - The country to parse the address as
* @returns {json} - The parsed address format
**/
AddressParser.prototype.parseRawAddress = function(address, iso) {
    //TODO: Add more extensive support and relations from US address address to other country address formats
    var p = parseAddress.parseAddress(address);
    if (!p) return null;

    var line1 = [ p.number, p.prefix, p.street, p.type ];
    if (p.sec_unit_type && p.sec_unit_num) { // check for apartment stuff
        line1[line1.length-1] += ',';
        line1.push(p.sec_unit_type);
        line1.push(p.sec_unit_num);
    }

    var result = {};
    result[templateKeyAsCurlyBrace(address1)] = line1.join(" ").replace(/\s{2,}/g, " ");
    result[templateKeyAsCurlyBrace(city)] = p.city + (p.state ? "," : "");
    result[templateKeyAsCurlyBrace(postalCode)] = p.zip;
    result[templateKeyAsCurlyBrace(state)] = p.state;
    return parseTemplate(this.getFormat(iso), result);
}

/**
* Parse the template using specified values
* @param template {json} - The address format template
* @param values {json} - The values to places into the template
* @returns {json} - The parsed template
**/
function parseTemplate(template, values) {
    var result = {};
    var i = 1;
    for (var line in template) {
        var formatString =  template[line].replace(regexLessThan, "{").replace(regexGreaterThan, "}");
        var parsed = format(formatString, values).trim();
        if (!parsed) continue;

        result["line_" + i] = parsed;
        i++;
    }
    return result;
}

AddressParser._ISO_MAP = null;

/**
* Populates the ISO map
*/
function populateISOMap() {
    if (AddressParser.ISO_MAP) return;

    AddressParser.ISO_MAP = {};
    function addISO(code, name) { AddressParser.ISO_MAP[code] = { code: code, name: name }; }
    addISO("AU", "Australia");
    addISO("BR", "Brazil");
    addISO("BG", "Bulgaria");
    addISO("CA", "Canada");
    addISO("CN", "China");
    addISO("HR", "Croatia");
    addISO("CZ", "Czech Republic");
    addISO("DK", "Denmark");
    addISO("FI", "Finland");
    addISO("FR", "France");
    addISO("DE", "Germany");
    addISO("GR", "Greece");
    addISO("HU", "Hungary");
    addISO("IT", "Italy");
    addISO("JP", "Japan");
    addISO("KR", "Korea");
    addISO("MY", "Malaysia");
    addISO("NL", "Netherlands");
    addISO("NO", "Norway");
    addISO("PL", "Poland");
    addISO("PT", "Portugal");
    addISO("RO", "Romania");
    addISO("RU", "Russia");
    addISO("CS", "Serbia");
    addISO("ES", "Spain");
    addISO("SI", "Slovenia");
    addISO("SE", "Sweden");
    addISO("CH", "Switzerland");
    addISO("TR", "Turkey");
    addISO("US", "United States");
}

/**
* Checks whether if ISO code is supported
*/
AddressParser.prototype.isISOSupported = function(iso) {
    populateISOMap();
    return !!AddressParser.ISO_MAP[iso];
}

exports.AddressParser = AddressParser;
