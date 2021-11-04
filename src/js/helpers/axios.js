import axios from 'axios'
import { applyAuthTokenInterceptor, setAuthTokens, setAccessToken } from 'axios-jwt';

// now with automatic handling of jwt auth via Auth0! w00t!

// this functions as a permanent "refresh token", i guess?
const clientCredentials = {
  client_id: 'Eoc5ukydqUDABT699fVbhKgfHmsmbXQJ',
  client_secret: 'O3GjtM5qhbnYio3GEdL8eVFLXNUjlTlT03r-F_my09tHu6NDPtW7xl8CrRVcbVfJ',
  audience: 'https://www.freecycle.org/api',
  grant_type: 'client_credentials'
}

export const API = axios.create({
  withCredentials: true,
  validateStatus: null
})

// Define token refresh function.
const requestRefresh = (refresh) => {
    console.debug('an api token refresh has been requested....', refresh);
    // Notice that this is the global axios instance, not the axiosInstance!  <-- important
    return axios.post(`https://freecycle.eu.auth0.com/oauth/token`, clientCredentials)
        // refresh, // not sure if we need this? a refresh token? what is that? ,
        .then((response) => {
            console.log('we have a response from Auth0', response.data);
            const tokenObject = response.data;
            // save tokens to local storage - i think we save the whole object, so that we have scope, expire times, etc
            setAuthTokens({
                accessToken: tokenObject,
                refreshToken: clientCredentials
            });
            setAccessToken(tokenObject);   // i think this actually loads the token for use.
            console.log('access token: ' + tokenObject.access_token);
            return tokenObject.access_token;
        });
};

applyAuthTokenInterceptor(API, {
    requestRefresh,
    header: 'Authorization',
    headerPrefix: 'Bearer '
});  // Notice that this uses the specific API instance of axios.  <-- important

export const handleError = e => {
  console.error('doh!' + e);
}

// we force a refresh when we first load just so we have a refresh token.
requestRefresh(clientCredentials).then( (token) => {
    console.debug('initial token request..', token);
/*    setAuthTokens({
        accessToken: token,
        refreshToken: clientCredentials
    });
    setAccessToken( token);*/
})
.catch((e) =>
    {
        handleError(e);
    });
