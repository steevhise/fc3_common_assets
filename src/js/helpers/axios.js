import axios from 'axios'
import {
    applyAuthTokenInterceptor,
    setAuthTokens,
    setAccessToken,
    refreshTokenIfNeeded,
    getAccessToken,
    getRefreshToken
} from 'axios-jwt';

// now with automatic handling of jwt auth via Auth0! w00t!

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
    const token = getAccessToken(); // check that we don't already have a good token
    if (!!token) {
        console.debug('oh we already have a token');
        return token.access_token;
    }
    // Notice that this is the global axios instance, not the axiosInstance!  <-- important
    return axios.post(`https://freecycle.eu.auth0.com/oauth/token`, clientCredentials)
        // refresh, // not sure if we need this? a refresh token? what is that? ,
        .then((response) => {
            console.log('we have a response from Auth0', response.data);
            const tokenObject = response.data;
            // save tokens to local storage - i think we save the whole object, so that we have scope, expire times, etc
            setAuthTokens({
                accessToken: tokenObject,
                refreshToken: { foo: "bar"}   // we aren't using refresh tokens right now so we fake it.
            });
            setAccessToken(tokenObject);   // i think this actually loads the token for use.
            console.log('access token: ' + tokenObject.access_token);
            return tokenObject.access_token;   // return just the token itself
        });
};

applyAuthTokenInterceptor(API, {
    requestRefresh,
    header: 'Authorization',
    headerPrefix: 'Bearer '
});  // Notice that this uses the specific API instance of axios.  <-- important

export const handleError = e => {
  console.error('axios error!' + e);
};

requestRefresh();
export const getJWT =  () => refreshTokenIfNeeded(requestRefresh);



