const Haversine = require('haversine');

const internals = {};

module.exports = {
    method: 'GET',
    path: '/home/my-towns',
    config: {
        id: 'home_mytowns',
        description: 'The logged in user\'s towns.',
        auth: { mode: 'required' }
    },
    handler: function (request, reply) {

        const { userService } = request.server;
        const { id: userId } = request.auth.credentials;

        return Promise.all([
            userService.fetchSettings(userId),
            userService.fetchFriendships(userId)
        ])
        .then(([{ homeTown, towns: groups }, friendships]) => {

            const homedata = groups.find((group) => group.id === homeTown);
            const ascHomeDistance = (g1, g2) => g1.distance - g2.distance;
            const locatedGroups = homedata ?
                    groups.map((g) => ({ ...g, distance: internals.measureFromHome(homedata, g) }))
                        .sort(ascHomeDistance)
                :
                    groups.sort(internals.groupNameSort);

            const geomap = locatedGroups.length >= 1 ? internals.generateMapData(locatedGroups) : null;

            reply.view('home/my_groups', {
                title: 'My Towns',
                data: {
                    homeTown: homedata,
                    locatedGroups,
                    geomap,
                    friendships
                },
                inBodyAds: [
                    'one',
                    'two'
                ]
            });
        });
    }
};


internals.measureFromHome = function (homeGroup, group) {

    const conf = { unit: 'mile' }; // TODO Any way to toggle this based on user setting?

    // hack for sorting groups w/ lat, lng (0,0) (null value) to bottom of list sent to view
    if (group.latitude === 0 && group.longitude === 0) {
        return Infinity;
    }

    return Number.parseFloat(Haversine(
        { latitude: homeGroup.latitude, longitude: homeGroup.longitude },
        { latitude: group.latitude, longitude: group.longitude },
        conf
    ).toFixed(0)); // TODO How do we adapt to different units?
};

// see map component for notes on configuration and settings expected
internals.generateMapData = (points) => {

    // user icon for home group
    // group icon for rest
    const markers = points.map((point, index) => ({
        lat: point.latitude,
        lng: point.longitude,
        description: point.name,
        icon: index === 0 ? 'user' : 'group' // differentiate home group
    }))
    .filter((point) => !(point.lat === 0 && point.lng === 0));

    const settings = {
        height: '400',
        width: '100%'
    };
    settings.center = { // center map on user's home group
        lat: points[0].latitude,
        lng: points[0].longitude
    };

    return {
        settings,
        markers
    };
};

internals.groupNameSort = (a, b) => {

    const nameA = a.name.toUpperCase(); // ignore upper and lowercase
    const nameB = b.name.toUpperCase();

    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }

    // names must be equal
    return 0;
};


/**** NOTE The below is all test content, just to exemplify the shape of the input to the google
maps API methods the geomap we configure here eventually interfaces with
***/

// see google docs for custom svg settings, these are just a few mainly the
// ones we would use to configure a new icon. but you can also pass things like maxWidth,
// and other settings as well https://developers.google.com/maps/documentation/javascript/symbols
const customIcon = {
    path : 'M10.75,0A6.25,6.25,0,0,0,4.5,6.25c0,6,6.25,13.75,6.25,13.75S17,12.22,17,6.25A6.25,6.25,0,0,0,10.75,0Zm0,9.7a3.38,3.38,0,1,1,3.38-3.38A3.37,3.37,0,0,1,10.75,9.7Z',
    fillColor : 'teal',
    fillOpacity : 0.8,
    strokeColor : 'white',
    scale : 2
};

const myGroupsGeomap = {
    settings: {
        'height' : '400',
        'width': '100%'
    },
    markers: [
        { 'lat' : 32.5, 'lng' : -110.09, 'description' : 'Tucson', 'icon' : 'group' },
        { 'lat' : 32.0, 'lng' : -111.09, 'description' : 'Oro Valley', 'icon' : 'user' },
        { 'lat' : 31.5, 'lng' : -110.09, 'description' : 'Green Valley', 'icon' : 'post' },
        { 'lat' : 33.5, 'lng' : -110.09, 'description' : 'Custom Marker Test', 'icon' : { custom : customIcon } },
        { 'lat' : 33.0, 'lng' : -110.09, 'description' : '<strong>No Icon Check</strong><br/><p>Also a test for html as the description</p>' },
        { 'lat' : 32.10, 'lng' : -110.09, 'description' : 'Read More Marker Test', 'readmore' : { text : 'Click Me', path : '/home/some-404-page/' } }
    ]
};
