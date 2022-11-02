import axios from 'axios'
import {
    applyAuthTokenInterceptor,
    setAuthTokens,
    setAccessToken,
    refreshTokenIfNeeded,
    getAccessToken,
    getRefreshToken
} from 'axios-jwt';

// now with automatic handling of jwt auth via Our own server!!!

const clientCredentials = {         // these are left over from the Auth0 days. except for the "a" param, which our server will want.
  developer_username: 'Eoc5ukydqUDABT699fVbhKgfHmsmbXQJ',
  developer_password: 'O3GjtM5qhbnYio3GEdL8eVFLXNUjlTlT03r-F_my09tHu6NDPtW7xl8CrRVcbVfJ',
  audience: 'https://www.freecycle.org/api',
  grant_type: 'client_credentials',
}

export const API = axios.create({
  withCredentials: true,
  validateStatus: null
})

// Define token refresh function.
const requestRefresh = (refresh) => {
    const token = getAccessToken(); // check that we don't already have a good token
    if (!!token) {
        console.debug('token refresh: we already have a token', token);
        if (token.exp > Date.now()) {
            console.debug('token is good')
            return token;
        }
    }

  /*  TODO: check if token is expired  - Axios needs to do whole process:
    1 - access token is expired or nonexistent, check refresh token
    2 - if no refresh token or it's expired, go to auth endpoint with credentials.
    3 - if refresh token IS still good, use that at the token endpoint
*/
    // if our access token is too old, use refresh token to get a new AT.
    const refreshToken = getRefreshToken();
    console.debug(refreshToken);
    if (!!refreshToken && refreshToken.exp > Date.now()) {
        console.debug('refresh token is good:', refreshToken);


    }

    // we have no good refresh token either, so hit the auth endpoint and then the token endpoint.
    const authUri = window.location.protocol + '//' + window.location.hostname + (window.location.port ? (':' + window.location.port) : '' ) + '/api/auth';

    // we need an auth code and a signature in the query param.
    const tokenUri = window.location.protocol + '//' + window.location.hostname + (window.location.port ? (':' + window.location.port) : '' ) + '/api/token';
    console.debug(tokenUri);

    // Notice that this is the global axios instance, not the axiosInstance!  <-- important
    console.debug('getting a new jwt...');
    return axios.post(tokenUri, clientCredentials)
        // refresh, // not sure if we need this? a refresh token? what tf is that?
        .then((response) => {
            console.debug('we have a response from token endpoint', response.data);
            const tokenObject = response.data;
            // save tokens to local storage - i think we save the whole object, so that we have scope, expire times, etc
            setAuthTokens({
                accessToken: tokenObject,
                refreshToken: tokenObject.refreshToken   //
            });
            setAccessToken(tokenObject);   // i think this actually loads the token for use.
            return tokenObject;   // return just the token itself
        });
};

applyAuthTokenInterceptor(API, {
    requestRefresh,
    header: 'Authorization',
    headerPrefix: 'Bearer '
});  // Notice that this uses the specific API instance of axios.  <-- important

export const handleError = e => {
  console.error('Axios error! ' + e);
};

requestRefresh();

export const getJWT =  () => refreshTokenIfNeeded(requestRefresh);



