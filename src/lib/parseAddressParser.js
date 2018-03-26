const parseAddress = require("parse-address");
import * as constants from '.constants'

function parseAddressString(address) {
    let p = parseAddress.parseAddress(address);
    if (!p) return null;

    let line1 = [ p.number, p.prefix, p.street, p.type ];
    if (p.sec_unit_type && p.sec_unit_num) { // check for apartment stuff
        line1[line1.length-1] += ",";
        line1.push(p.sec_unit_type);
        line1.push(p.sec_unit_num);
    }

    let result = {};
    result[constants.ADDRESS_1] = line1.join(" ").replace(/\s{2,}/g, " ");
    result[constants.CITY] = p.city + (p.state ? "," : "");
    result[constants.POSTAL_CODE] = p.zip;
    result[constants.STATE] = p.constants.STATE;
    return result;
}