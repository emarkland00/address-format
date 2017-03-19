var express = require('express');
var router = express.Router();

var parseAddress = require('parse-address');

const ISO_MAP = {};
function addISO(code, name) { ISO_MAP[code] = { code: code, name: name }; }
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
// List of address formats
// https://msdn.microsoft.com/en-us/library/cc195167.aspx
// http://www.bitboost.com/ref/international-address-formats.html#Formats

function optionalPart(addressPart) {
    /// Mark the address part as optional
    return "[" + addressPart + "]";
}

function getFormat(iso) {
    /// Get the corresponding home address format
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
    var result = {};
    result[iso] = {
        address_format: addressFormat
    };
    return result;
}

router.get("/", function (req, res) {
	var iso = req.query.iso;
	if (!iso || iso.length !== 2) {
		res.status(400).json({
			error: "Must specify ISO code (2 letter country code) to retrieve corresponding address format"
		});
		res.end();
	}

    var code = iso.toUpperCase();
    if (!ISO_MAP[code]) {
        res.status(400).json({
            error: "ISO Code " + iso + " is either unknown or unsupported at this time"
        });
        res.end();
    }

	res.send(getFormat(code));
	res.end();
});

router.get("/parse", function (req, res) {
    var address = req.query.address;
    if (!address) {
        res.status(400).json({
            error: "Must provide US-based address to parse"
        });
        res.end();
    }
    var parsed = parseAddress.parseAddress(address);
    if (!parsed) {
        res.status(400).json({
            error: "Failed to parse address"
        });
        res.end();
    }
    res.send(parsed);
    res.end();
});

module.exports = router;
