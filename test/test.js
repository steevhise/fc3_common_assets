const Code = require('code');
const Lab = require('lab');
const App = require('../server');

const { describe, before, it } = exports.lab = Lab.script();
const { expect } = Code;

describe('Deployment', () => {

    let server;

    before(() => {

        return App.deployment().then((srv) => {

            // This server is initialized, which means caches are running
            // and everything is good to go– there's just no live HTTP listener.
            // Can still use server.inject() no problem, for example.

            server = srv;
        });
    });

    it('responds with 404 error page when requesting a page that doesn\'t exist.', () => {

        return server.inject('/not-a-page')
        .then(({ result, statusCode }) => {

            expect(result).to.contain('<h1>404</h1>');
            expect(result).to.contain('Sorry, that page is not available.');
            expect(statusCode).to.equal(404);
        });
    });
});
