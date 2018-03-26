import * as constants from '.constants';


let _ISO_MAP = null;
function ISOMap() {
    populateISOMap();
}

ISOMap.prototype.getISOFormat = function(code) {
    if (!isISOSupported(code)) {
        return null;
    }

    return _ISO_MAP[code];
}

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
    _ISO_MAP[code] = { 
        code: code, 
        name: name, 
        format: format 
    };
}

/**
* Populates the ISO map
*/
function populateISOMap() {
    if (_ISO_MAP) return;

    _ISO_MAP = {};
    addISO("AU", "Australia", [
        [ constants.HONORIFICS, constants.FIRST_NAME, constants.MIDDLE_NAME, constants.LAST_NAME ],
        [ constants.ADDRESS_1 ],
        [ optionalPart(constants.ADDRESS_2) ],
        [ constants.CITY, constants.STATE, constants.POSTAL_CODE ],
        [ optionalPart(constants.COUNTRY) ],
    ]);
    addISO("US", "United States", "AU");

    addISO("BR", "Brazil", [
        [ optionalPart(constants.COMPANY_NAME) ],
        [ constants.HONORIFICS, constants.FIRST_NAME, constants.MIDDLE_NAME, constants.LAST_NAME ],
        [ constants.ADDRESS_1 ],
        [ constants.POSTAL_CODE, constants.CITY, constants.STATE ],
        [ optionalPart(constants.COUNTRY) ]
    ]);

    addISO("BG", "Bulgaria", [
        [ optionalPart(constants.COUNTRY) ],
        [ constants.STATE ],
        [ constants.POSTAL_CODE, constants.CITY ],
        [ constants.ADDRESS_1 ],
        [ constants.ADDRESS_2 ],
        [ optionalPart(constants.COMPANY_NAME) ],
        [ constants.HONORIFICS, constants.FIRST_NAME, constants.MIDDLE_NAME, constants.LAST_NAME ]
    ]);

    addISO("CA", "Canada", [
        [ constants.HONORIFICS, constants.FIRST_NAME, constants.LAST_NAME ],
        [ optionalPart(constants.COMPANY_NAME) ],
        [ constants.ADDRESS_1 ],
        [ constants.CITY, constants.PROVINCE, constants.POSTAL_CODE ],
        [ optionalPart(constants.COUNTRY) ]
    ]);

    addISO("CN", "China", [
        [ optionalPart(constants.COUNTRY) ],
        [ constants.PROVINCE, constants.CITY ],
        [ constants.ADDRESS_1 ],
        [ constants.LAST_NAME, constants.FIRST_NAME, constants.HONORIFICS ]
    ]);

    addISO("HR", "Croatia", [
        [ constants.HONORIFICS, constants.FIRST_NAME, constants.MIDDLE_NAME, constants.LAST_NAME ],
        [ constants.STREET_NUMBER, constants.STREET_NUMBER ],
        [ constants.APARTMENT_NUMBER ],
        [ constants.POSTAL_CODE, constants.CITY ],
        [ constants.STATE ],
        [ optionalPart(constants.COUNTRY_CODE), constants.POSTAL_CODE, constants.CITY ],
        [ optionalPart(constants.COUNTRY) ]
    ]);
    addISO("CZ", "Czech Republic", "HR");
    addISO("CS", "Serbia", "HR");
    addISO("SI", "Slovenia", "HR");

    addISO("DK", "Denmark", [
        [ optionalPart(constants.HONORIFICS + " " + constants.TITLE), constants.FIRST_NAME, optionalPart(constants.MIDDLE_NAME), constants.LAST_NAME ],
        [ optionalPart(constants.COMPANY_NAME) ],
        [ constants.ADDRESS_1 ],
        [ constants.ADDRESS_2 ],
        [ optionalPart(constants.COUNTRY_CODE) ],
    ]);

    addISO("FI", "Finland", [
        [ optionalPart(constants.TITLE), constants.FIRST_NAME, optionalPart(constants.MIDDLE_NAME), constants.LAST_NAME ],
        [ optionalPart(constants.COMPANY_NAME) ],
        [ constants.ADDRESS_1 ],
        [ constants.ADDRESS_2 ],
        [ constants.POSTAL_CODE, constants.CITY ],
        [ optionalPart(constants.COUNTRY) ],
    ]);

    addISO("FR", "France", [
        [ constants.HONORIFICS, constants.FIRST_NAME, constants.LAST_NAME ],
        [ optionalPart(constants.COMPANY_NAME) ],
        [ constants.ADDRESS_1 ],
        [ constants.ADDRESS_2 ],
        [ constants.POSTAL_CODE, constants.CITY ],
        [ optionalPart(constants.COUNTRY) ]
    ]);

    addISO("DE", "Germany", [
        [ optionalPart(constants.COMPANY_NAME) ],
        [ constants.HONORIFICS, optionalPart(constants.TITLE), constants.FIRST_NAME, constants.LAST_NAME ],
        [ constants.ADDRESS_1 ],
        [ constants.ADDRESS_2 ],
        [ constants.BLANK_LINE ],
        [ optionalPart(constants.COUNTRY), constants.POSTAL_CODE, constants.CITY ]
    ]);

    addISO("GR", "Greece", [
        [ optionalPart(constants.TITLE), constants.FIRST_NAME, optionalPart(constants.MIDDLE_NAME), constants.LAST_NAME ],
        [ constants.COMPANY_NAME ],
        [ constants.ADDRESS_1 ],
        [ constants.ADDRESS_2 ],
        [ constants.POSTAL_CODE, constants.CITY ],
        [ optionalPart(constants.COUNTRY) ]
    ]);
    addISO("HU", "Hungary", [
        [ constants.HONORIFICS, constants.LAST_NAME, constants.FIRST_NAME ],
        [ constants.CITY ],
        [ constants.ADDRESS_1 ],
        [ constants.POSTAL_CODE ],
        [ constants.STATE ],
        [ optionalPart(constants.COUNTRY) ]
    ]);

    addISO("IT", "Italy", [
        [ constants.TITLE, constants.FIRST_NAME, constants.LAST_NAME ],
        [ optionalPart(constants.COMPANY_NAME) ],
        [ constants.ADDRESS_1 ],
        [ constants.BLANK_LINE ],
        [ optionalPart(constants.COUNTRY_ABBREVIATION), constants.POSTAL_CODE, constants.CITY, constants.PROVINCE ],
        [ optionalPart(constants.COUNTRY) ]
    ]);

    addISO("JP", "Japan", [
        [ optionalPart(constants.COUNTRY) ],
        [ constants.POSTAL_CODE, constants.PREFECTURE, constants.CITY ],
        [ constants.ADDRESS_1 ],
        [ constants.COMPANY_NAME ],
        [ constants.LAST_NAME, constants.FIRST_NAME, constants.HONORIFICS ]
    ]);

    addISO("KR", "Korea", [
        [ optionalPart(constants.COUNTRY) ],
        [ constants.POSTAL_CODE ],
        [ constants.PROVINCE, constants.CITY, constants.ADDRESS_1 ], // constants.PROVINCE = do, constants.CITY = si, constants.ADDRESS_1 = <dong> <gu> <Address#>
        [ constants.COMPANY_NAME ],
        [ constants.LAST_NAME, constants.FIRST_NAME, constants.HONORIFICS ]
    ]);

    addISO("MY", "Malaysia", [
        [ constants.HONORIFICS, constants.FIRST_NAME, constants.MIDDLE_NAME, constants.LAST_NAME ],
        [ optionalPart(constants.COMPANY_NAME) ],
        [ constants.ADDRESS_1 ],
        [ constants.ADDRESS_2 ],
        [ constants.POSTAL_CODE, constants.CITY ],
        [ constants.STATE, optionalPart(constants.COUNTRY) ]
    ]);

    addISO("NL", "Netherlands", [
        [ constants.TITLE, constants.FIRST_NAME, constants.MIDDLE_NAME, constants.LAST_NAME ],
        [ optionalPart(constants.COMPANY_NAME) ],
        [ constants.ADDRESS_1 ],
        [ constants.ADDRESS_2 ],
        [ constants.POSTAL_CODE, constants.CITY],
        [ optionalPart(constants.COUNTRY) ]
    ]);

    addISO("NO", "Norway", [
        [ optionalPart(constants.JOB_TITLE), constants.FIRST_NAME, constants.LAST_NAME ],
        [ constants.ADDRESS_1 ],
        [ constants.POSTAL_CODE, constants.CITY ],
        [ optionalPart(constants.COUNTRY) ]
    ]);

    addISO("PL", "Poland", [
        [ optionalPart(constants.COUNTRY) ],
        [ constants.POSTAL_CODE ],
        [ optionalPart(constants.STATE), optionalPart(constants.REGION), constants.CITY ],
        [ constants.ADDRESS_1 ],
        [ constants.ADDRESS_2 ],
        [ optionalPart(constants.COMPANY_NAME) ],
        [ constants.LAST_NAME ],
        [ constants.FIRST_NAME, constants.MIDDLE_NAME ]
    ]);
    addISO("RU", "Russia", "PL");

    addISO("PT", "Portugal", [
        [ constants.HONORIFICS, constants.FIRST_NAME, constants.MIDDLE_NAME, constants.LAST_NAME ],
        [ optionalPart(constants.COMPANY_NAME) ],
        [ constants.ADDRESS_1 ],
        [ constants.ADDRESS_2 ],
        [ constants.CITY ],
        [ constants.POSTAL_CODE ],
        [ optionalPart(constants.COUNTRY_CODE) ]
    ]);

    addISO("RO", "Romania", [
        [ constants.HONORIFICS, constants.FIRST_NAME, constants.MIDDLE_NAME, constants.LAST_NAME ],
        [ optionalPart(constants.COMPANY_NAME) ],
        [ constants.ADDRESS_1 ],
        [ constants.ADDRESS_2 ],
        [ constants.POSTAL_CODE, constants.CITY ],
        [ constants.STATE ],
        [ optionalPart(constants.COUNTRY) ]
    ]);

    addISO("ES", "Spain", [
        [ constants.HONORIFICS, constants.FIRST_NAME, constants.MIDDLE_NAME, constants.LAST_NAME ],
        [ constants.SECOND_LAST_NAME ],
        [ optionalPart(constants.COMPANY_NAME) ],
        [ constants.ADDRESS_1 ],
        [ constants.POSTAL_CODE, constants.CITY ],
        [ optionalPart(constants.COUNTRY) ]
    ]);

    addISO("SE", "Sweden", [
        [ optionalPart(constants.JOB_TITLE), constants.FIRST_NAME, constants.LAST_NAME ],
        [ constants.ADDRESS_1 ],
        [ constants.POSTAL_CODE, constants.CITY ],
        [ optionalPart(constants.COUNTRY) ]
    ]);

    addISO("CH", "Switzerland", [
        [ constants.HONORIFICS, constants.FIRST_NAME, constants.LAST_NAME ],
        [ constants.ADDRESS_1 ],
        [ constants.POSTAL_CODE, constants.CITY ],
        [ optionalPart(constants.COUNTRY) ]
    ]);

    addISO("TR", "Turkey", [
        [ constants.HONORIFICS, constants.FIRST_NAME, constants.MIDDLE_NAME, constants.LAST_NAME ],
        [ optionalPart(constants.COMPANY_NAME) ],
        [ constants.ADDRESS_1 ],
        [ constants.ADDRESS_2 ],
        [ constants.POSTAL_CODE, constants.CITY ],
        [ optionalPart(constants.COUNTRY) ]
    ]);
}

/**
* Checks whether if ISO code is supported
*
* List of supported address formats https://msdn.microsoft.com/en-us/library/cc195167.aspx
* May add more from http://www.bitboost.com/ref/international-address-formats.html#Formats
*/
function isISOSupported(iso) {
    return !!ISO_MAP[iso];
};

exports.ISOMap = ISOMap;