# README #

## What is this repository for ##

* This repo holds our development for the address format API.

## How do I get set up ##

* Ensure that node is installed on your machine
* Clone this repo to your machine, then cd to it
* Run `npm install` in that directory
* Run `npm start` to initialize the express app. A local server will be generated on your localhost at port 3000

## How do I get set up (docker edition) ##

* Ensure docker is installed
* Go to root folder and run `docker-compose up`.
* Everything should be loaded up

## Needed files ##

The address parsing functionality is given from the opencage api `https://opencagedata.com/api`.
Ensure that a `.env` file is in the root directory, and it contains the API_KEY generated from the open cage api site.

It should be of the form `API_KEY=<pasted_api_key_value>`

## Notes ##

Note: Our current list of supported countries comes from this link: `https://msdn.microsoft.com/en-us/library/cc195167.aspx`

## Current API routes ##

* `/api/format?iso=<ISO_CODE>` - Gets the API format for a given ISO code. Example (in localhost): `http://localhost:3000/api/format?iso=US`
* `/api/parse?query=<address>&iso=<ISO_CODE|US>` - Parse the input address in terms of the given ISO code. ISO code defaults to US. Example (in localhost): `http://localhost:3000/api/parse?query=20 W 34th St, New York, NY 10001&iso=jp`
