var express = require('express');
var router = express.Router();

const ISO_MAP = {};
function addISO(code, name) { ISO_MAP[code] = { code: code, name: name }; }
addISO("US", "United States");
addISO("HR", "Croatia");
addISO("CS", "Serbia");
addISO("SI", "Slovenia");
addISO("CZ", "Czech Republic");

// address parts
const title = "<title>";
const honorific = "<honorific>";
const firstName = "<first_name>";
const middleName = "<middle_name>";
const lastName = "<last_name>";
const secondLastName = "<second_last_name>";
const streetNumber = "<street_number>";
const streetName = "<street_name>";
const apartmentNumber = "<apartment_number>";
const city = "<city>";
const state = "<state>";
const postalCode = "<postal_code>";
const country = "<country>";
const countryCode = "<country_code>";
const province = "<province>";
const prefecture = "<prefecture>";
const blankLine = "<blank_line>";

// List of address formats
// https://msdn.microsoft.com/en-us/library/cc195167.aspx
// http://www.bitboost.com/ref/international-address-formats.html#Formats

function optionalPart(addressPart) {
    return "[" + addressPart + "]";
}

// home addresses
function getFormat(iso) {
    //TODO: Add method for optional address parts
    var addressMatrix = [];
    switch (iso.toUpperCase()) {
        case "AU":
        case "US":
            addressMatrix = [
                [ honorific, firstName, middleName, lastName ],
                [ streetNumber, streetName ],
                [ optionalPart(apartmentNumber) ],
                [ city, state, postalCode ],
                [ optionalPart(country) ],
            ];
            break;

        case "HR":
        case "CS":
        case "SI":
        case "CZ":
            addressMatrix = [
                [ honorific, firstName, middleName, lastName ],
                [ streetNumber, streetNumber ],
                [ apartmentNumber ],
                [ postalCode, city ],
                [ state ],
                [ optionalPart(country) ],
            ];
    }

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
	if (!iso) {
		res.status(400).json({
			error: "Must specify ISO code to retrieve corresponding address format"
		});
		res.end();
	}

	res.send(getFormat(iso));
	res.end();
});

module.exports = router;
