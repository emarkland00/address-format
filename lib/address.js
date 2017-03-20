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
**/
AddressParser.prototype.getFormat = function(iso) {
    var addressFormat = {};
    var selectedCountry = AddressParser.ISO_MAP[iso];
    console.log(selectedCountry);
    if (!selectedCountry) return addressFormat;

    // render the selected address format as json
    var addressMatrix = selectedCountry.format;
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
    function addISO(code, name, addressFormatOrRelatedISO) {
        var format = addressFormatOrRelatedISO;
        if (typeof addressFormatOrRelatedISO === 'string') {
            var relatedCountry = AddressParser.ISO_MAP[addressFormatOrRelatedISO];
            if (relatedCountry) {
                format = relatedCountry.format;
            }
        } else if (!Array.isArray(addressFormatOrRelatedISO)){
            format = null;
        }

        if (!format) return;
        AddressParser.ISO_MAP[code] = { code: code, name: name, format: format };
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
        [ optionalPart(honorific + ' ' + title), firstName, optionalPart(middleName), lastName ],
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
AddressParser.prototype.isISOSupported = function(iso) {
    populateISOMap();
    return !!AddressParser.ISO_MAP[iso];
}

exports.AddressParser = AddressParser;
