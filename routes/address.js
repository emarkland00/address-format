var express = require('express');
var router = express.Router();

const addressParser = require('../lib/address.js');
const parser = new addressParser.AddressParser();

function capitalizeISOCode(iso) {
    if (!iso || typeof iso !== 'string' || iso.length !== 2) return null;
    return iso.toUpperCase();
}

router.get("/format", function (req, res) {
	var iso = capitalizeISOCode(req.query.iso || '');
	if (!iso) {
		res.status(400).json({
			error: "Must specify ISO code (2 letter country code) to retrieve corresponding address format"
		});
		res.end();
	}

    var code = iso.toUpperCase();
    if (!parser.isISOSupported(code)) {
        res.status(400).json({
            error: "ISO Code " + iso + " is either unknown or unsupported at this time"
        });
        res.end();
    }

    var result = {};
    result[code] = {
        address_format: parser.getFormat(code)
    };
	res.send(result);
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

    var iso = capitalizeISOCode(req.query.iso || "US");
    if (!parser.isISOSupported(iso)) {
        res.status(400).json({
            error: "ISO Code " + iso + " is either unknown or unsupported at this time"
        });
        res.end();
    }
    var parsed = parser.parseRawAddress(address, iso);
    if (!parsed) {
        res.status(400).json({
            error: "Failed to parse address"
        });
    } else {
        res.send(parsed);
    }
    res.end();
});

module.exports = router;
