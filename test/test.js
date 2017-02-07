

// const A = require('assert');
// const Code = require('code');
// const Expect = Code.expect;
// const Lab = require('lab');
// const lab = exports.lab = Lab.script();

const App = require('../lib/index.js');   // require the whole server app? can we do that?

const server = App.server;

console.log(server.methods);

// query = '{ user (where: {username: "steevhise"}) { user_id } }';

// const query = 5;

// server.methods.wrapGraphQL(query, 'user.user_id', function(err, result) { server.log('debug', err + result.user.user_id) });

// This test stuff is harder than it looks. Just ignore for now.

/*
lab.experiment('basic arithmetic', function () {
    lab.test('+ should add numbers together', function (done) {
        A(1 + 1 === 2);
        done();
    });

    lab.test('‐ should subtract numbers', function (done) {
        A(10 - 2 === 8);
        done();
    });
}); */

// lab.experiment('graphql wrapper: ', function () {

    // var query = '{ user (where: {username: "steevhise"}) { user_id } }';

    // TODO: these are out of date, the graphql wrapper is now NOT a hapi plugin.
   /* lab.test('missing query should throw an error', function(done) {
       Code.expect(server.methods.wrapGraphQL(null, 'user.user_id', (err, result) => { console.log(err, result);})).to.throw();    // should throw a Boom object, right?
       done();
   });

    lab.test('missing or wrong type dataWanted should throw an error', function(done) {
        Code.expect(server.methods.wrapGraphQL(query, 5, (err, result) => { console.log(err, result);})).to.throw();    // should throw a Boom object, right?
        done();
    });

    lab.test('missing callback should throw an error', function(done) {
        Code.expect(server.methods.wrapGraphQL(query, 'user.user_id')).to.throw();    // should throw a Boom object, right?
        done();
    });*!/

   console.log(typeof server.methods.wrapGraphQL);

/!*    lab.test('bad query should throw an error', function(done) {
        Code.expect(server.methods.wrapGraphQL('bad query', 'user.user_id', (err, result)=>console.log(err, result))).to.throw();
        done();
    });

    */

   // this doesn't work. but if i just call the server method normally outside of a lab test, it does. so fuck it. fuck you, lab.

 /*   lab.test('should return user_id 23736881', function(done) {
        Expect(   server.methods.wrapGraphQL(query, 'user.user_id',
            function(err, result) { server.log('debug', result.user.user_id); return result.user.user_id;  }) )
            .to.equal(23736881);
        done();

    }); */

// });
