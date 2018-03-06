module.exports = (server, options) => ([
    require('bell'),
    {
        register: require('@freecycle/common-hapi-plugins/plugins/redirect-by-cookie'),
        options: {
            isSecure: !options.dev
        }
    },
    {
        register: require('@freecycle/common-hapi-plugins/plugins/auth-cookie-freecycle')
    },
    {
        register: require('hapi-authorization'),       // TODO: not ported to hapi 17
        options: {
            // roles: [...server.privileges.keys()]     // this will be a list of all the privilege ids, if we pre-define them.
            roles: false   // by default no roles are required.
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
