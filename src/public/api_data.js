define({ "api": [
  {
    "type": "get",
    "url": "/format?iso=<iso>",
    "title": "/format",
    "version": "0.1.0",
    "name": "Format",
    "group": "API",
    "description": "<p>Get address format for country code</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "iso",
            "description": "<p>Country ISO code</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "json",
            "description": "<p>The address format</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Invalid ISO-code has been entered</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example url:",
        "content": "https://addressformat.errolmarkland.com/api/format?iso=US",
        "type": "https"
      }
    ],
    "filename": "routes/api.js",
    "groupTitle": "API"
  },
  {
    "type": "get",
    "url": "/parse?address=<address>&iso=<iso>",
    "title": "/parse",
    "name": "Parse",
    "version": "0.1.0",
    "group": "API",
    "description": "<p>Parse US-based address into specified country address format. In the future, support for additional address formats will be added</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "iso",
            "description": "<p>Country ISO code</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": false,
            "field": "address",
            "description": "<p>The US-based address to convert</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "json",
            "optional": false,
            "field": "json",
            "description": "<p>The address restructured to match the specified format</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "Error 4xx": [
          {
            "group": "Error 4xx",
            "optional": false,
            "field": "BadRequest",
            "description": "<p>Invalid ISO or US-based address code entered</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example URL:",
        "content": "https://addressformat.errolmarkland.com/api/parse?address=123 Main Street, New York, NY 10001&iso=JP",
        "type": "https"
      }
    ],
    "filename": "routes/api.js",
    "groupTitle": "API"
  }
] });
