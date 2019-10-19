import stringTemplate from 'string-template';

// address parts
const title = '{title}';
const honorific = '{honorific}';
const firstName = '{firstName}';
const middleName = '{middleName}';
const lastName = '{lastName}';
const secondLastName = '{secondLastName}';
const companyName = '{companyName}';
const streetNumber = '{streetNumber}';
const streetName = '{streetName}';
const address1 = '{address1}';
const address2 = '{address2}';
const apartmentNumber = '{apartmentNumber}';
const city = '{city}';
const state = '{state}';
const postalCode = '{postalCode}';
const country = '{country}';
const countryCode = '{countryCode}';
const countryAbbreviation = '{countryAbbreviation}';
const province = '{province}';
const prefecture = '{prefecture}';
const jobTitle = '{jobTitle}';
const region = '{region}';
const blankLine = '{blankLine}';

/**
* Get the corresponding country address format
* @param {string} iso - The country ISO code
* @return {object} - The address format for the specified country
**/
export function getAddressFormatTemplate(iso) {
    if (!isIsoSupported(iso)) {
        return [];
    }

    const addressFormat = ISO_MAP[iso.toUpperCase()].format;
    const templatizedAddress = addressFormat
        .map((entry, index) => ({ entry, index }))
        .reduce((overall, cur) => ({
            ...overall,
            [`line_${cur.index+1}`]: cur.entry.join(' ')
        }), {});

    return templatizedAddress;
};

/**
 * Parse address, matching the specified country
 * @param {object} addressFormatOpts - The address format objects
 * @param {string} iso - The country code to show the address as
 * @return {object} The object representation of the tempalte
 */
export function parseAddressWithTemplate(addressFormatOpts, iso) {
    if (!isIsoSupported(iso)) {
        return '';
    }

    const addressTemplate = getAddressFormatTemplate(iso);
    return parseTemplate(addressTemplate, addressFormatOpts);
};

/**
* Parse the template using specified values
* @param {object} templateObject - The address format template
* @param {object} valuesObject - The values to places into the template
* @return {object} - The parsed template
**/
function parseTemplate(templateObject, valuesObject) {
    // list values from template object
    const templateValues = Object.values(templateObject);

    // Swap template values with actual non-empty values. Enumerate each line
    const enumeratedParsedValues = templateValues
        .map(removeOptionalBraces)
        .map(formatString => stringTemplate(formatString, valuesObject).trim())
        .filter(parsed => !!parsed)
        .map((parsed, i) => ({ parsed, i }));

    // Return a json object containing each line of the address
    return enumeratedParsedValues.reduce((result, item) => ({
        ...result,
        [`line_${item.i+1}`]: item.parsed
    }), {});
}

let ISO_MAP = null;

/**
* Populates the ISO map
*/
function populateIsoMap() {
    if (ISO_MAP) return;

    ISO_MAP = {};

    /**
     * Add an ISO to the mapping of ISO codes
     * @param {string} code - The ISO code
     * @param {string} name - The full name representation
     * @param {string|object} addressFormatOrRelatedISO - The existing address format or corresponding ISO code
     */
    function addISO(code, name, addressFormatOrRelatedISO) {
        let format = addressFormatOrRelatedISO;
        if (typeof addressFormatOrRelatedISO === 'string') {
            const relatedCountry = ISO_MAP[addressFormatOrRelatedISO];
            if (relatedCountry) {
                format = relatedCountry.format;
            }
        } else if (!Array.isArray(addressFormatOrRelatedISO)) {
            format = null;
        }

        if (!format) return;
        ISO_MAP[code] = { code: code, name: name, format: format };
    }

    addISO('AU', 'Australia', [
        [ honorific, firstName, middleName, lastName ],
        [ address1 ],
        [ optionalPart(address2) ],
        [ city, state, postalCode ],
        [ optionalPart(country) ],
    ]);
    addISO('US', 'United States', 'AU');

    addISO('BR', 'Brazil', [
        [ optionalPart(companyName) ],
        [ honorific, firstName, middleName, lastName ],
        [ address1 ],
        [ postalCode, city, state ],
        [ optionalPart(country) ]
    ]);

    addISO('BG', 'Bulgaria', [
        [ optionalPart(country) ],
        [ state ],
        [ postalCode, city ],
        [ address1 ],
        [ address2 ],
        [ optionalPart(companyName) ],
        [ honorific, firstName, middleName, lastName ]
    ]);

    addISO('CA', 'Canada', [
        [ honorific, firstName, lastName ],
        [ optionalPart(companyName) ],
        [ address1 ],
        [ city, province, postalCode ],
        [ optionalPart(country) ]
    ]);

    addISO('CN', 'China', [
        [ optionalPart(country) ],
        [ province, city ],
        [ address1 ],
        [ lastName, firstName, honorific ]
    ]);

    addISO('HR', 'Croatia', [
        [ honorific, firstName, middleName, lastName ],
        [ streetNumber, streetNumber ],
        [ apartmentNumber ],
        [ postalCode, city ],
        [ state ],
        [ optionalPart(countryCode), postalCode, city ],
        [ optionalPart(country) ]
    ]);
    addISO('CZ', 'Czech Republic', 'HR');
    addISO('CS', 'Serbia', 'HR');
    addISO('SI', 'Slovenia', 'HR');

    addISO('DK', 'Denmark', [
        [ optionalPart(honorific + ' ' + title), firstName, optionalPart(middleName), lastName ],
        [ optionalPart(companyName) ],
        [ address1 ],
        [ address2 ],
        [ optionalPart(countryCode) ],
    ]);

    addISO('FI', 'Finland', [
        [ optionalPart(title), firstName, optionalPart(middleName), lastName ],
        [ optionalPart(companyName) ],
        [ address1 ],
        [ address2 ],
        [ postalCode, city ],
        [ optionalPart(country) ],
    ]);

    addISO('FR', 'France', [
        [ honorific, firstName, lastName ],
        [ optionalPart(companyName) ],
        [ address1 ],
        [ address2 ],
        [ postalCode, city ],
        [ optionalPart(country) ]
    ]);

    addISO('DE', 'Germany', [
        [ optionalPart(companyName) ],
        [ honorific, optionalPart(title), firstName, lastName ],
        [ address1 ],
        [ address2 ],
        [ blankLine ],
        [ optionalPart(country), postalCode, city ]
    ]);

    addISO('GR', 'Greece', [
        [ optionalPart(title), firstName, optionalPart(middleName), lastName ],
        [ companyName ],
        [ address1 ],
        [ address2 ],
        [ postalCode, city ],
        [ optionalPart(country) ]
    ]);
    addISO('HU', 'Hungary', [
        [ honorific, lastName, firstName ],
        [ city ],
        [ address1 ],
        [ postalCode ],
        [ state ],
        [ optionalPart(country) ]
    ]);

    addISO('IT', 'Italy', [
        [ title, firstName, lastName ],
        [ optionalPart(companyName) ],
        [ address1 ],
        [ blankLine ],
        [ optionalPart(countryAbbreviation), postalCode, city, province ],
        [ optionalPart(country) ]
    ]);

    addISO('JP', 'Japan', [
        [ optionalPart(country) ],
        [ postalCode, prefecture, city ],
        [ address1 ],
        [ companyName ],
        [ lastName, firstName, honorific ]
    ]);

    addISO('KR', 'Korea', [
        [ optionalPart(country) ],
        [ postalCode ],
        [ province, city, address1 ], // province = do, city = si, address1 = <dong> <gu> <Address#>
        [ companyName ],
        [ lastName, firstName, honorific ]
    ]);

    addISO('MY', 'Malaysia', [
        [ honorific, firstName, middleName, lastName ],
        [ optionalPart(companyName) ],
        [ address1 ],
        [ address2 ],
        [ postalCode, city ],
        [ state, optionalPart(country) ]
    ]);

    addISO('NL', 'Netherlands', [
        [ title, firstName, middleName, lastName ],
        [ optionalPart(companyName) ],
        [ address1 ],
        [ address2 ],
        [ postalCode, city ],
        [ optionalPart(country) ]
    ]);

    addISO('NO', 'Norway', [
        [ optionalPart(jobTitle), firstName, lastName ],
        [ address1 ],
        [ postalCode, city ],
        [ optionalPart(country) ]
    ]);

    addISO('PL', 'Poland', [
        [ optionalPart(country) ],
        [ postalCode ],
        [ optionalPart(state), optionalPart(region), city ],
        [ address1 ],
        [ address2 ],
        [ optionalPart(companyName) ],
        [ lastName ],
        [ firstName, middleName ]
    ]);
    addISO('RU', 'Russia', 'PL');

    addISO('PT', 'Portugal', [
        [ honorific, firstName, middleName, lastName ],
        [ optionalPart(companyName) ],
        [ address1 ],
        [ address2 ],
        [ city ],
        [ postalCode ],
        [ optionalPart(countryCode) ]
    ]);

    addISO('RO', 'Romania', [
        [ honorific, firstName, middleName, lastName ],
        [ optionalPart(companyName) ],
        [ address1 ],
        [ address2 ],
        [ postalCode, city ],
        [ state ],
        [ optionalPart(country) ]
    ]);

    addISO('ES', 'Spain', [
        [ honorific, firstName, middleName, lastName ],
        [ secondLastName ],
        [ optionalPart(companyName) ],
        [ address1 ],
        [ postalCode, city ],
        [ optionalPart(country) ]
    ]);

    addISO('SE', 'Sweden', [
        [ optionalPart(jobTitle), firstName, lastName ],
        [ address1 ],
        [ postalCode, city ],
        [ optionalPart(country) ]
    ]);

    addISO('CH', 'Switzerland', [
        [ honorific, firstName, lastName ],
        [ address1 ],
        [ postalCode, city ],
        [ optionalPart(country) ]
    ]);

    addISO('TR', 'Turkey', [
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
* @param {string} iso - The ISO code to check
* @return {boolean} True is the code is supported. False, if otherwise
* List of supported address formats https://msdn.microsoft.com/en-us/library/cc195167.aspx
* May add more from http://www.bitboost.com/ref/international-address-formats.html#Formats
*/
export function isIsoSupported(iso) {
    populateIsoMap();
    return !!ISO_MAP[iso];
};

/**
 * Address format parser
 * @return {object} The functions used for address format parsing
 */
export function addressFormatParser() {
    populateIsoMap();
    return {
        isISOSupported: isIsoSupported,
        parseAddress: parseAddressWithTemplate
    };
};

/**
* Mark the address part as optional
* @param {string} addressPart - The address to mark
* @return {string} The optional address part
**/
function optionalPart(addressPart) {
    return '[' + addressPart + ']';
}

/**
 * Removes the optional braces from the entry
 * @param {string} entry - The entry to remove braces from
 * @return {string} The entry without optional braces
 */
function removeOptionalBraces(entry) {
    return entry.replace(/\[/gi, '').replace(/\]/g, '');
}

