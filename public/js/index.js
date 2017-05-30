var routes = {
    format: {
        name: 'format',
        description: 'Shows the address format of the specified country'
    },
    parse: {
        name: 'parse',
        description: 'Parse the US-based address to the specified address format'
    }
};

function selectRoute(event) {
    // stops the page from refreshing after processing event
    event.preventDefault();

    // ensure description box is being rendered. otherwise render it
    let descriptionBox = document.getElementById('description-container');
    if (descriptionBox === null) {
        console.log("Unable to find the description container.");
        return;
    }

    // get path to render from the defined routes json
    let route = event.target.text;
    let selectedName = route.substr(1);
    let selectedRoute = routes[selectedName];
    if (selectedRoute === undefined) {
        console.log('Unknown route name ' + selectedName + ' was specified');
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

function addRouteListener(idName) {
    var el = document.getElementById(idName);
    if (el === null) return;
    if (el.addEventListener) {
        el.addEventListener('click', selectRoute, false);
    } else if (el.attachEvent) {
        el.attachEvent('click', selectRoute);
    }
}

for (let r in routes) {
    addRouteListener(r);
}
