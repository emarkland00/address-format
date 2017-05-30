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
                        element.innerHTML = "/format?iso=<input class='iso' type='text' />";
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
                        element.innerHTML = "/parse?address=<input type='text' class='input-address' />&iso=<input type='text' class='input-iso' />";
                    }
                    return element;
                };
            }
        }
    }
};

function selectRouteEvent(event) {
    // stops the page from refreshing after processing event
    event.preventDefault();

    // get path to render from the defined routes json
    let route = event.target.text;
    let selectedName = route.substr(1);
    let selectedRoute = routes[selectedName];
    if (selectedRoute === undefined) {
        console.log('Unknown route name ' + selectedName + ' was specified');
        return;
    }

    selectRoute(selectedRoute);
    displayRequestTemplate(selectedRoute);
}

function selectRoute(selectedRoute) {
    // ensure description box is being rendered. otherwise render it
    let descriptionBox = document.getElementById('description-container');
    if (descriptionBox === null) {
        console.log("Unable to find the description container.");
        return;
    }

    // check if current event is being shown
    let pathName = 'path-name';
    let name = document.getElementById(pathName);
    if (name === null) {
        name = document.createElement('div');
        name.setAttribute('id', pathName);
        descriptionBox.appendChild(name);
    }

    // skip over if already selected
    if (name.textContent == selectedRoute.name) return;
    name.textContent = selectedRoute.name;

    let pathDescription = 'path-description';
    let desc = document.getElementById(pathDescription);
    if (desc === null) {
        desc = document.createElement('div');
        desc.setAttribute('id', pathDescription);
        descriptionBox.appendChild(desc);
    }
    desc.textContent = selectedRoute.description;
}

function displayRequestTemplate(selectedRoute) {
    // check if current event is being shown
    let pathName = 'path-name';
    let name = document.getElementById(pathName);
    if (name === null) {
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

function addRouteListener(idName) {
    var el = document.getElementById(idName);
    if (el === null) return;
    if (el.addEventListener) {
        el.addEventListener('click', selectRouteEvent, false);
    } else if (el.attachEvent) {
        el.attachEvent('click', selectRouteEvent);
    }
}

let firstElementSelected = false;
for (let r in routes) {
    addRouteListener(r);

    if (firstElementSelected) continue;
    var route = routes[r];
    selectRoute(route);
    displayRequestTemplate(route);
    firstElementSelected = true;
}
