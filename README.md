# README #

## What is this repository for ##

* This repo holds our development for the address format API.

## How do I get set up ##

* Ensure that node is installed on your machine
* Clone this repo to your machine, then cd to it
* Run `npm install` in that directory
* Run `npm start` to initialize the express app. A local server will be generated on your localhost at port 3000
* Test it out by visiting the address `http://localhost:3000/api/format/<ISO_CODE>` in your browser or running the cURL command (in another terminal): `curl -i http://localhost:3000/api/format/<ISO_CODE>`

Example: `http://localhost:3000/api/format/US`

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
