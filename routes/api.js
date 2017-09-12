var express = require('express');
var router = express.Router();

const addressParser = require('../lib/address.js');
const parser = new addressParser.AddressParser();

function capitalizeISOCode(iso) {
    if (!iso || typeof iso !== 'string' || iso.length !== 2) return null;
    return iso.toUpperCase();
}

router.get("/", function(req, res) {
    res.render('api', { title: 'Address Format API' });
});

/**
* @api {get} /format?iso=<iso> /format
* @apiVersion 0.1.0
* @apiName Format
* @apiGroup API
* @apiDescription Get address format for country code
* @apiParam {string} iso Country ISO code
* @apiSuccess {json} json The address format
* @apiError BadRequest Invalid ISO-code has been entered
* @apiExample {https} Example url:
*       https://addressformat.errolmarkland.com/api/format?iso=US
**/
function getAddressFormat(req, res) {
    var iso = capitalizeISOCode(req.query.iso || '');
	if (!iso) {
		res.status(400).json({
			error: "Must specify ISO code (2 letter country code) to retrieve corresponding address format"
		});
		res.end();
        return;
	}

    var code = iso.toUpperCase();
    if (!parser.isISOSupported(code)) {
        res.status(400).json({
            error: "ISO Code " + iso + " is either unknown or unsupported at this time"
        });
        res.end();
        return;
    }

    var result = {};
    result[code] = {
        address_format: parser.getFormat(code)
    };
	res.send(result);
	res.end();
}
router.get("/format", getAddressFormat);

/**
* @api {get} /parse?address=<address>&iso=<iso> /parse
* @apiName Parse
* @apiVersion 0.1.0
* @apiGroup API
* @apiDescription Parse US-based address into specified country address format. In the future, support for additional address formats will be added
* @apiParam {string} iso Country ISO code
* @apiParam {string} address The US-based address to convert
* @apiSuccess {json} json The address restructured to match the specified format
* @apiError BadRequest Invalid ISO or US-based address code entered
* @apiExample {https} Example URL:
*       https://addressformat.errolmarkland.com/api/parse?address=123 Main Street, New York, NY 10001&iso=JP
**/
function parseAddress(req, res) {
    var address = decodeURIComponent(req.query.address);
    if (!address) {
        res.status(400).json({
            error: "Must provide US-based address to parse"
        });
        res.end();
        return;
    }

    var iso = capitalizeISOCode(req.query.iso || "US");
    if (!parser.isISOSupported(iso)) {
        res.status(400).json({
            error: "ISO Code " + iso + " is either unknown or unsupported at this time"
        });
        res.end();
        return;
    }

    var parsed = parser.parseRawAddress(address, iso);
    if (!parsed) {
        res.status(400).json({
            error: "Failed to parse address"
        });
        return;
    }

    res.send(parsed);
    res.end();
}
router.get("/parse", parseAddress);

module.exports = router;
