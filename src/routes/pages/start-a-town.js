const Joi = require('joi');
const Boom = require('boom');
const RouteHelpers = require('../helpers');

module.exports = {
    method: '*',
    path: '/startatown',
    config: {
        id: 'start_a_group',
        description: 'Apply to start a new town',
        validate: {
            failAction: RouteHelpers.formFailAction,
            payload: Joi.object({
                step1: Joi.any().allow(''),
                step2: Joi.any().allow(''),
                country: Joi.string()
                    .label('Country'),
                region: Joi.string()
                    .label('Region'),
                city: Joi.string()
                    .label('City'),
                address: Joi.string()
                    .label('Address'),
                name: Joi.string()
                    .label('Name'),
                comment: Joi.string()
                    .label('Comment')
            })
                .and('country', 'region', 'city', 'address', 'name', 'comment')
                .xor('step1', 'step2', 'country'),
            options: {
                abortEarly: false,
                language: {
                    key: '{{!key}} field ',
                    and: '!!{{presentWithLabels}} is required'
                }
            }
        },
        pre: [
            {
                assign: 'completed',
                method: (request, reply) => {

                    const { startATown } = request.state;
                    const skip = () => reply(startATown || {});

                    if (!request.payload) {
                        return skip();
                    }

                    // Login is part of this flow!
                    // Might need to login while moving from step2 to step3.
                    // See also handler code in routes/pages/login.js

                    request.app.formValidation = request.app.formValidation || [];
                    const { step1, step2, ...submitted } = request.payload;
                    const exists = (val) => typeof val !== 'undefined';

                    if (!startATown && exists(step1)) {

                        if (!step1) {
                            request.app.formValidation.push({
                                type: 'form',
                                path: 'step1',
                                message: 'Please acknowledge that you have checked the Freecycle map, and that there is no existing group very close to you.'
                            });
                            return skip();
                        }

                        const completed = { step1: true };
                        reply.state('startATown', completed);
                        return reply(completed);
                    }
                    else if (startATown && startATown.step1 && exists(step2)) {

                        if (!step2) {
                            request.app.formValidation.push({
                                type: 'form',
                                path: 'step2',
                                message: 'Please acknowledge that by applying for a new group in your location, you are offering to moderate and promote the group yourself.'
                            });
                            return skip();
                        }

                        const completed = { step2: true };
                        reply.state('startATown', completed);
                        return reply(completed);
                    }
                    else if (startATown && startATown.step2 && exists(submitted.country) && !submitted.validation) {
                        // TODO send email through gearman
                        reply.unstate('startATown');
                        return reply({ success: true });
                    }

                    return skip();
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

        if (!completed.step1 && !completed.step2 && !completed.success) {
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

            const { validation, ...submitted } = request.payload || {};

            if (validation) {
                validation.info.forEach(({ path }) => {

                    delete submitted[path];
                });
            }

            return view({
                step3: submitted
            });
        }
        else if (completed.success) {
            return view({
                success: {}
            });
        }

        throw Boom.badImplementation('This should never happen, startATown cookie is in a bad state');
    }
};
