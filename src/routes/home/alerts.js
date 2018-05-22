const Joi = require('joi');
const RouteHelpers = require('../helpers');

const internals = {};

module.exports = {
    method: '*',
    path: '/home/alerts',
    config: ({ alertService }) => ({
        id: 'home_alerts',
        description: 'The logged in user\'s alerts page (also supports setting new alerts).',
        auth:  { mode: 'required' },
        validate: {
            failAction: RouteHelpers.formFailAction,
            payload: Joi.object({
                newAlertTag: Joi.number()
                    .integer()
                    .min(1)
                    .label('New Alert Tag'),
                deleteAlertTag: Joi.number()
                    .integer()
                    .min(1)
                    .label('Alert To Delete')
            }).xor('newAlertTag', 'deleteAlertTag')
        },
        pre: [
            (request, reply) => {

                if (request.method === 'get' || request.app.formValidation) {
                    return reply.continue();
                }

                // Handle post and return to the page — Route supports both deleting and creating alerts
                const { id: userId } = request.auth.credentials;
                const { newAlertTag, deleteAlertTag } = request.payload;

                const alertAction = newAlertTag ? alertService.create(userId, { tagId: newAlertTag }) : alertService.delete(userId, { tagId: deleteAlertTag });

                return Promise.resolve()
                .then(() => alertAction)
                .then((success) => {

                    if (!success) { // create doesn't return true, delete returns 0
                        throw new Error('Alert action failed due to unmatching input');
                    }

                    return reply.continue();
                })
                .catch(reply);
            }
        ]
    }),
    handler: function (request, reply) {

        const { alertService, postService } = request.server;
        const { id: userId } = request.auth.credentials;

        return Promise.all([
            postService.fetchTags(),
            alertService.forUser(userId)
        ])
        .then(([tags, alerts]) => {

            const unalertedTags = tags.filter((tag) => !alerts.find((alert) => alert.tag.id === tag.id));
            const formattedSuccess = request.payload ? internals.formatPostSuccessMessage(request.payload, tags) : null;

            return alertService.seeAlerts(userId)
            .then(() =>

                    reply.view('home/alerts', {
                        title: 'Alerts',
                        data: {
                            alerts,
                            formattedSuccess,
                            unalertedTags
                        },
                        inBodyAds: [
                            'one', 'two'
                        ]
                    }
            ));
        });
    }
};


internals.formatPostSuccessMessage = (payload, tags) => {

    const { newAlertTag, deleteAlertTag } = payload;
    let message = null;

    if (newAlertTag) {
        message = `You will now receive alerts for posts tagged as ${tags.find((t) => t.id === newAlertTag).name}`;
    }
    else if (deleteAlertTag) {
        message = 'Alert deleted!';
    }

    return message;
};
