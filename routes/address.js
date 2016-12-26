var express = require('express');
var router = express.Router();

router.get("/", function (req, res) {
	function usFormat() {
		return {
			format: "<Recipent Name>\n<street number> <street name>\n<City Name> <State>, <Zip>"
		};
	}

	var iso = req.query.iso;
	if (!iso) {
		res.status(400).json({
			error: "Must specify ISO to retrieve corresponding address format"
		});
		res.end();
	}

	iso = iso.toUpperCase();
	if (iso === 'US') {
		res.send(usFormat());
	}


	res.end();
});

module.exports = router;