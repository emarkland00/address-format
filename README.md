## Address Format API ##

## What is this repository for ##

This repo holds the development for the address format API.

## Why did you create this? ##

Earlier in my career in a previous job, I helped to facilate invoice billing to enterprise clients. The company used to retrieve domestic and foreign clients. Domestic clients were easy to bill because I was familiar with the US address format system but I struggled to quickly interpret foreign address formats.

At that time, I wished there was some kind of service that can take what I know (US address format) and transpose those components into a different countries format. This would help me to understand what are common components and how this should be arranged.

Since I couldn't find anything, I decided why not create it myself. And here we are.

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

Note: The current list of supported countries comes from this link: `https://msdn.microsoft.com/en-us/library/cc195167.aspx`

## Current API routes ##

* `/api/format?iso=<ISO_CODE>` - Gets the API format for a given ISO code. Example (in localhost): `http://localhost:3000/api/format?iso=US`
* `/api/parse?query=<address>&iso=<ISO_CODE|US>` - Parse the input address in terms of the given ISO code. ISO code defaults to US. Example (in localhost): `http://localhost:3000/api/parse?query=20 W 34th St, New York, NY 10001&iso=jp`

## I like this API but I don't have time to install it myself. Do you have this up on an API I can use? ##

Yes, I do! You can reach this at `https://addressformat.errolmarkland.com/api/`. For example, `https://addressformat.errolmarkland.com/api/format?iso=US`.

That being said, I am paying for all of this out of pocket. If this becomes really popular and the api usage spikes, the bills will spike. If it becomes unaffordable,
I'd have to take down the site to handle my financial obligations.

If you like this and would like to ensure this remains available, please considering making a small donation.

Bitcoin address: `398EszwW2GBJSQ6TkZVCydyBL1XnaMUPAF`

ETH address: `0xCf267D1eaBf2d128fED30aE2aa92ea093C11D4A6`

Litecoin Address: `M8zcAQ4qhZWNfzUZoANUfA1hVYDbNck9fa`
