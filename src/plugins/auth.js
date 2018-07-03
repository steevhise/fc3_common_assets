module.exports = (server, options) => ([
    require('bell'),
    {
        register: require('@freecycle/common-hapi-plugins/plugins/redirect-by-cookie'),
        options: {
            isSecure: !options.dev
        }
    },
    {
        register: require('@freecycle/common-hapi-plugins/plugins/auth-cookie-freecycle'),
        options: {
            domain: 'freecycle.org'
        }
    }
    /*
    {
          register: require('crumb'),     // security against CRSF attacks.
          options: {
              cookieOptions: {            // TODO: this broke, maybe bug in Crumb?
                  isSecure: false,
                  isHttpOnly: true
              }
          }
      }
      */
]);
