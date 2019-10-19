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
    const isoUpper = (iso || '').toUpperCase();
    if (!isIsoSupported(isoUpper)) {
        return [];
    }

    const addressFormat = ISO_MAP[isoUpper].format;
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
    const addressTypeMap = {
        'string': input => (ISO_MAP[input] || {}).format,
        'object': input => Array.isArray(input) ? input : null
    };

    const handleAddressOrIso = input => {
        const fn = addressTypeMap[typeof input] || (_ => null);
        return fn(input);
    };

    const addIsoToMap = (code, name, addressFormatOrRelatedISO) => {
        const format = handleAddressOrIso(addressFormatOrRelatedISO);
        if (!format) return;
        ISO_MAP[code] = { code: code, name: name, format: format };
    };

    addIsoToMap('AU', 'Australia', [
        [ honorific, firstName, middleName, lastName ],
        [ address1 ],
        [ optionalPart(address2) ],
        [ city, state, postalCode ],
        [ optionalPart(country) ],
    ]);
    addIsoToMap('US', 'United States', 'AU');

    addIsoToMap('BR', 'Brazil', [
        [ optionalPart(companyName) ],
        [ honorific, firstName, middleName, lastName ],
        [ address1 ],
        [ postalCode, city, state ],
        [ optionalPart(country) ]
    ]);

    addIsoToMap('BG', 'Bulgaria', [
        [ optionalPart(country) ],
        [ state ],
        [ postalCode, city ],
        [ address1 ],
        [ address2 ],
        [ optionalPart(companyName) ],
        [ honorific, firstName, middleName, lastName ]
    ]);

    addIsoToMap('CA', 'Canada', [
        [ honorific, firstName, lastName ],
        [ optionalPart(companyName) ],
        [ address1 ],
        [ city, province, postalCode ],
        [ optionalPart(country) ]
    ]);

    addIsoToMap('CN', 'China', [
        [ optionalPart(country) ],
        [ province, city ],
        [ address1 ],
        [ lastName, firstName, honorific ]
    ]);

    addIsoToMap('HR', 'Croatia', [
        [ honorific, firstName, middleName, lastName ],
        [ streetNumber, streetNumber ],
        [ apartmentNumber ],
        [ postalCode, city ],
        [ state ],
        [ optionalPart(countryCode), postalCode, city ],
        [ optionalPart(country) ]
    ]);
    addIsoToMap('CZ', 'Czech Republic', 'HR');
    addIsoToMap('CS', 'Serbia', 'HR');
    addIsoToMap('SI', 'Slovenia', 'HR');

    addIsoToMap('DK', 'Denmark', [
        [ optionalPart(honorific + ' ' + title), firstName, optionalPart(middleName), lastName ],
        [ optionalPart(companyName) ],
        [ address1 ],
        [ address2 ],
        [ optionalPart(countryCode) ],
    ]);

    addIsoToMap('FI', 'Finland', [
        [ optionalPart(title), firstName, optionalPart(middleName), lastName ],
        [ optionalPart(companyName) ],
        [ address1 ],
        [ address2 ],
        [ postalCode, city ],
        [ optionalPart(country) ],
    ]);

    addIsoToMap('FR', 'France', [
        [ honorific, firstName, lastName ],
        [ optionalPart(companyName) ],
        [ address1 ],
        [ address2 ],
        [ postalCode, city ],
        [ optionalPart(country) ]
    ]);

    addIsoToMap('DE', 'Germany', [
        [ optionalPart(companyName) ],
        [ honorific, optionalPart(title), firstName, lastName ],
        [ address1 ],
        [ address2 ],
        [ blankLine ],
        [ optionalPart(country), postalCode, city ]
    ]);

    addIsoToMap('GR', 'Greece', [
        [ optionalPart(title), firstName, optionalPart(middleName), lastName ],
        [ companyName ],
        [ address1 ],
        [ address2 ],
        [ postalCode, city ],
        [ optionalPart(country) ]
    ]);
    addIsoToMap('HU', 'Hungary', [
        [ honorific, lastName, firstName ],
        [ city ],
        [ address1 ],
        [ postalCode ],
        [ state ],
        [ optionalPart(country) ]
    ]);

    addIsoToMap('IT', 'Italy', [
        [ title, firstName, lastName ],
        [ optionalPart(companyName) ],
        [ address1 ],
        [ blankLine ],
        [ optionalPart(countryAbbreviation), postalCode, city, province ],
        [ optionalPart(country) ]
    ]);

    addIsoToMap('JP', 'Japan', [
        [ optionalPart(country) ],
        [ postalCode, prefecture, city ],
        [ address1 ],
        [ companyName ],
        [ lastName, firstName, honorific ]
    ]);

    addIsoToMap('KR', 'Korea', [
        [ optionalPart(country) ],
        [ postalCode ],
        [ province, city, address1 ], // province = do, city = si, address1 = <dong> <gu> <Address#>
        [ companyName ],
        [ lastName, firstName, honorific ]
    ]);

    addIsoToMap('MY', 'Malaysia', [
        [ honorific, firstName, middleName, lastName ],
        [ optionalPart(companyName) ],
        [ address1 ],
        [ address2 ],
        [ postalCode, city ],
        [ state, optionalPart(country) ]
    ]);

    addIsoToMap('NL', 'Netherlands', [
        [ title, firstName, middleName, lastName ],
        [ optionalPart(companyName) ],
        [ address1 ],
        [ address2 ],
        [ postalCode, city ],
        [ optionalPart(country) ]
    ]);

    addIsoToMap('NO', 'Norway', [
        [ optionalPart(jobTitle), firstName, lastName ],
        [ address1 ],
        [ postalCode, city ],
        [ optionalPart(country) ]
    ]);

    addIsoToMap('PL', 'Poland', [
        [ optionalPart(country) ],
        [ postalCode ],
        [ optionalPart(state), optionalPart(region), city ],
        [ address1 ],
        [ address2 ],
        [ optionalPart(companyName) ],
        [ lastName ],
        [ firstName, middleName ]
    ]);
    addIsoToMap('RU', 'Russia', 'PL');

    addIsoToMap('PT', 'Portugal', [
        [ honorific, firstName, middleName, lastName ],
        [ optionalPart(companyName) ],
        [ address1 ],
        [ address2 ],
        [ city ],
        [ postalCode ],
        [ optionalPart(countryCode) ]
    ]);

    addIsoToMap('RO', 'Romania', [
        [ honorific, firstName, middleName, lastName ],
        [ optionalPart(companyName) ],
        [ address1 ],
        [ address2 ],
        [ postalCode, city ],
        [ state ],
        [ optionalPart(country) ]
    ]);

    addIsoToMap('ES', 'Spain', [
        [ honorific, firstName, middleName, lastName ],
        [ secondLastName ],
        [ optionalPart(companyName) ],
        [ address1 ],
        [ postalCode, city ],
        [ optionalPart(country) ]
    ]);

    addIsoToMap('SE', 'Sweden', [
        [ optionalPart(jobTitle), firstName, lastName ],
        [ address1 ],
        [ postalCode, city ],
        [ optionalPart(country) ]
    ]);

    addIsoToMap('CH', 'Switzerland', [
        [ honorific, firstName, lastName ],
        [ address1 ],
        [ postalCode, city ],
        [ optionalPart(country) ]
    ]);

    addIsoToMap('TR', 'Turkey', [
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
    return !!ISO_MAP[iso.toUpperCase()];
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

