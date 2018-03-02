module.exports = {
    method: 'GET',
    path: '/home/my-towns',
    config: {
        id: 'home_mygroups',
        description: 'The logged in user\'s towns.',
        auth: { mode: 'required' }
    },
    handler: function (request, reply) {

        reply.view('home/my_groups', {
            title: 'My Towns',
            myGroups,
            geomap: myGroupsGeomap,
            inBodyAds: [
                'one',
                'two'
            ]
        });
    }
};

const myGroups = [
    {
        name: 'Tucson',
        state: 'AZ',
        distance: '0 miles' // unit should probably be separated for our UK bros, correct?
    },
    {
        name: 'Marana',
        state: 'AZ',
        distance: '15 miles'
    },
    {
        name: 'Vail',
        state: 'AZ',
        distance: '15 miles'
    },
    {
        name: 'Oro Valley',
        state: 'AZ',
        distance: '15 miles'
    }
];

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
