const Path = require('path');

// Build absolute path relative to project
const rel = (path) => Path.resolve(__dirname, '../../', path);

module.exports = [
    {
        method: 'GET',
        path: '/images/{param*}',
        config: {
            tags: ['exclude'],
            auth: false
        },
        handler: {
            directory: {
                path: rel('public/assets/images'),
                listing: true
            }
        }
    },
    {
        method: 'GET',
        path: '/font/{param*}',
        config: {
            tags: ['exclude'],
            auth: false
        },
        handler: {
            directory: {
                path: rel('public/assets/font'),
                listing: true
            }
        }
    },
    {
        method: 'GET',
        path: '/js/{param*}',
        config: {
            id: 'js',
            description: 'directory where Front-end javascript code goes',
            tags: ['js', 'exclude'],
            auth: false
        },
        handler: {
            directory: {
                path: rel('public/assets/js'),
                listing: true
            }
        }
    },
    {
        method: 'GET',
        path: '/css/{param*}',
        config: {
            id: 'css',
            description: 'directory where Front-end css code goes',
            tags: ['css', 'exclude'],
            auth: false
        },
        handler: {
            directory: {
                path: rel('public/assets/css'),
                listing: true
            }
        }
    },
    {
        method: 'GET',
        path: '/ckeditor/{param*}',
        config: {
            tags: ['exclude', 'js'],
            auth: false
        },
        handler: {
            directory: {
                path: rel('node_modules/ckeditor'),
                listing: true
            }
        }
    }
];
