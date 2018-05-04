const Boom = require('boom');
const Countries = require('../../assets/js/modules/countries');

module.exports = {
    method: '*',
    path: '/startatown',
    config: {
        id: 'start_a_group',
        description: 'Apply to start a new town',
        pre: [
            {
                assign: 'completed',
                method: (request, reply) => {

                    const { startATown } = request.state;

                    if (!request.payload) {
                        return reply(startATown || {});
                    }

                    // Login is part of this flow!
                    // Might need to login while moving from step2 to step3.
                    // See also handler code in routes/pages/login.js

                    const { step1, step2 } = request.payload;

                    if (!startATown && step1) {
                        const completed = { step1: true };
                        reply.state('startATown', completed);
                        return reply(completed);
                    }
                    else if (startATown && startATown.step1 && step2) {
                        const completed = { step2: true };
                        reply.state('startATown', completed);
                        return reply(completed);
                    }

                    return reply(startATown || {});
                }
            }
        ]
    },
    handler: (request, reply) => {

        const { completed } = request.pre;
        const { isAuthenticated } = request.auth;
        const view = (data) => {

            return reply.view('start_a_group', {
                title: 'Start a Town',
                data
            });
        };

        if (!completed.step1 && !completed.step2) {
            return view({ step1: {} });
        }
        else if (completed.step1) {
            return view({ step2: {} });
        }
        else if (completed.step2) {

            if (!isAuthenticated) {
                reply.state('redirect', { to: '/startatown' });
                return reply.redirect('/login').temporary();
            }

            return view({
                step3: {
                    countries: Countries
                }
            });
        }

        throw Boom.badImplementation('This should never happen, startATown cookie is in a bad state');
    }
};
