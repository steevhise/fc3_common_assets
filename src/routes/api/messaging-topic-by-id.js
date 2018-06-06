const Joi = require('joi');

const internals = {};

module.exports = {
    // Envisioning requests like /post-mine/{{post id}} as well as /system (class-less / id-less topics)
    path: '/api/messaging/topics/{type}/{id?}', // TODO What happens if you omit identifier? Goes to list route?
    method: 'GET',
    config: {
        description: 'Endpoint for retrieving all threads on a specified topic',
        tags: ['api'],
        auth: { mode: 'required' },
        validate: {
            params: {
                type: Joi.string()
                    .valid('post-mine', 'post-theirs', 'dm', 'system', 'group')
                    .required(),
                id: Joi.when(
                    'type',
                    {
                        is: 'system',
                        then: Joi.forbidden(),
                        otherwise: Joi.number().required()
                    }
                )
            }
        }
    },
    handler: (request, reply) => {

        /*
            const { id: userId } = request.auth.credentials;
            const { type, id } = request.params;
            const { messageService } = request.server;

            **** How do you say...Given this topic, give me all threads? (a topic is an id of a specified entity)
            return messageService.fetchThreadsByTopic(userId, type, id)
            .then((threads) => reply(threads));
        */

        // Search all threads for the given id of the given class?

        return reply(internals.mock);
    }
};

// TODO Do we need to sort threads? 0th thread (one opened by default) is the one last updated? Probably handle that service-side?
// manually ordered reverse chronologically for now :)

// TODO Do we need to retrieve topic data, too? Seems like we're asking for a topic's threads, not the topic itself? But including
// topic could be good for completeness / ease of debugging on the frontend (verifying you got the data you think you asked for?)
internals.mock = {
    topic: {
        // Mine (owning user) is here defined as fc3-devtest
        type: 'post-mine',
        post: {
            id: 65229292,
            subject: 'Godzilla doll',
            image: null, // TODO Do we want to set a default image? Frontend / template concern?
            type: {
                typeId: 3,
                const: 'FC_POST_WANTED',
                name: 'WANTED'
            }
        }
    },
    unreadCount: 10,
    updatedAt: '2018-06-05T18:13:42.516Z',
    threads: [
        {
            id: 1,
            user: {
                id: 1,
                username: 'deronbeal'
            }, // User you are talking with; Possibly null in case of system/group topic
            unreadCount: 2,
            updatedAt: '2018-06-05T18:13:42.516Z'
        },
        {
            id: 2,
            user: {
                id: 26619977,
                username: 'zackbrs'
            },
            unreadCount: 5,
            updatedAt: '2018-06-04T18:13:42.516Z'
        },
        {
            id: 3,
            user: {
                id: 23736881,
                username: 'steevhise'
            },
            unreadCount: 3,
            updatedAt: '2018-06-03T18:13:42.516Z'
        }
    ]
};
