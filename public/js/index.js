// Registered API routes
var routes = {
    format: {
        name: 'format',
        description: 'Shows the address format of the specified country',
        request: {
            template: function() {
                var element = null;
                return function() {
                    if (element === null) {
                        element = document.createElement('div');
                        element.innerHTML = "/format?iso=<input class='input input-iso' type='text' />";
                    }
                    return element;
                };
            }
        }
    },
    parse: {
        name: 'parse',
        description: 'Parse the US-based address to the specified address format',
        request: {
            template: function() {
                var element = null;
                return function() {
                    if (element == null) {
                        element = document.createElement('div');
                        element.innerHTML = "/parse?address=<input type='text' class='input input-address' />&iso=<input type='text' class='input input-iso' />";
                    }
                    return element;
                };
            }
        }
    }
};

/**
* On-click handler for route events
**/
function selectRouteEvent(event) {
    // stops the page from refreshing after processing event
    event.preventDefault();

    // get path to render from the defined routes json
    let route = event.target.text;
    if (route === undefined) return;

    let selectedName = route.substr(1);
    let selectedRoute = routes[selectedName];
    if (selectedRoute === undefined) {
        console.log('Unknown route name ' + selectedName + ' was specified');
        return;
    }

    selectRoute(selectedRoute);
    displayRequestTemplate(selectedRoute);
}

function processAJAXRequest(event) {
    event.preventDefault();

    // find all class items containing input in the request container
    let items = document.getElementsByClassName('input');
    if (!items || !items.length) return;

    // check if current event is being shown
    let pathName = 'path-name';
    let name = document.getElementById(pathName);
    if (name === null) return;
    let route = routes[name.textContent];

    // fill in json payload
    let classRegex = /input\-([a-z]+)/;
    let qs = [];
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let match = classRegex.exec(item.className);
        if (match && item.value) {
            qs.push(match[1] + '=' + item.value);
        }
    }

    if (qs.length === 0) return;
    var urlPath = '/api/' + route.name + '?' + qs.join('&');

    // create API request
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', urlPath, true);
    xmlhttp.setRequestHeader('Accept', 'application/json');
    xmlhttp.setRequestHeader('Content-Type', 'application/json');

    // set callback
    xmlhttp.onreadystatechange = function(xhr) {
        if (xmlhttp.readyState == XMLHttpRequest.DONE) {
            if (xmlhttp.status == 200) {
                // get json response
                var responseJSON = JSON.parse(xhr.target.response);
                displayResponse(route, urlPath, responseJSON);
            }
        }
    };

    // make request
    xmlhttp.send();
}

/**
* Renders the response json from the API
**/
function displayResponse(route, urlPath, json) {
    // Get response json container
    let responseName = 'response-container';
    let responseContainer = document.getElementById(responseName);

    // empty it out
    while (responseContainer.firstChild) {
        responseContainer.removeChild(responseContainer.firstChild);
    }

    // show url
    let req = document.createElement('code');
    req.textContent = urlPath;
    responseContainer.appendChild(req);

    // show json response
    let res = document.createElement('pre');
    res.textContent = JSON.stringify(json);
    responseContainer.appendChild(res);
}

/**
* Selects the route via the navigation column
**/
function selectRoute(selectedRoute) {
    // ensure description box is being rendered. otherwise render it
    let descriptionBox = document.getElementById('description-container');
    if (!descriptionBox) {
        console.log("Unable to find the description container.");
        return;
    }

    // check if current event is being shown
    let pathName = 'path-name';
    let name = document.getElementById(pathName);
    if (!name) {
        name = document.createElement('div');
        name.setAttribute('id', pathName);
        descriptionBox.appendChild(name);
    }

    // skip over if already selected
    if (name.textContent == selectedRoute.name) return;
    name.textContent = selectedRoute.name;

    let pathDescription = 'path-description';
    let desc = document.getElementById(pathDescription);
    if (!desc) {
        desc = document.createElement('div');
        desc.setAttribute('id', pathDescription);
        descriptionBox.appendChild(desc);
    }
    desc.textContent = selectedRoute.description;
}

/**
* Displays the current selected route via the API explorer
**/
function displayRequestTemplate(selectedRoute) {
    // check if current event is being shown
    let pathName = 'path-name';
    let name = document.getElementById(pathName);
    if (!name) {
        console.log('Must have current route selected.');
        return;
    }

    let containerName = 'request-container';
    let requestContainer = document.getElementById(containerName);

    // select template node
    let templateName = 'request-template';
    let requestTemplate = document.getElementById(templateName);

    // clear all existing children
    while (requestTemplate.firstChild) { requestTemplate.removeChild(requestTemplate.firstChild); }

    // append current route as child
    let templateFn = selectedRoute.request.template();
    requestTemplate.appendChild(templateFn());
}

/**
* Method to add a click-event listener to the id
**/
function addRouteListener(idName) {
    let el = document.getElementById(idName);
    if (!el) return;

    let listener = el.addEventListener || el.attachEvent;
    listener('click', selectRouteEvent, false);
}

// start up this script by selecting the first element in the list of routes
let firstElementSelected = false;
for (let r in routes) {
    addRouteListener(r);

    if (firstElementSelected) continue;
    let route = routes[r];
    selectRoute(route);
    displayRequestTemplate(route);
    firstElementSelected = true;
}

// register on-click event for request submit button
let requestSubmit = document.getElementById('request-submit');
if (requestSubmit) {
    let listener = requestSubmit.addEventListener || requestSubmit.attachEvent;
    listener('click', processAJAXRequest, false);
}
