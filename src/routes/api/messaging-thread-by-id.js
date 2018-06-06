const Joi = require('joi');

const internals = {};

module.exports = {
    method: 'get',
    path: '/api/messaging/threads/{identifier}',
    config: {
        tags: ['api'],
        auth: { mode: 'required' },
        validate: {
            params: {
                identifier: Joi.any()
            }
        },
        handler(request, reply) {

            const { id } = request.auth.credentials;
            const messages = [...(new Array(100))].map(() => internals.message(id));

            return reply({
                id: request.params.identifier,
                topic: {
                    type: 'post-mine',
                    post: {
                        id: 50268218,
                        subject: 'King size divan base',
                        type: {
                            typeId: 1,
                            const: 'FC_POST_OFFER',
                            name: 'OFFER'
                        }
                    }
                },
                user: { id: 1, username: 'deronbeal' },
                unreadCount: 3,
                messages: internals.sortByCreatedAt(messages)
                    .map(internals.setId)
                    .map(internals.markThreeRead)
            });
        }
    }
};

internals.message = (currentUserId) => {

    const now = Date.now();
    const randomTimeInPastMonth = Math.round(Math.random() * 1000 * 60 * 60 * 24 * 30);

    return {
        id: null,
        createdAt: new Date(now - randomTimeInPastMonth),
        userId: internals.getRandom([currentUserId, 1]), // The current user and Deron chat
        read: true,
        body: internals.getRandom([
            'So, do you want this huge divan base?',
            'Hmmmm, I can\'t really decide if I want this divan base',
            'That\'s okay, you have a little bit of time to decide',
            'Thanks for all the time for me to make this big decision'
        ])
    };
};

internals.sortByCreatedAt = (arr) => arr.sort((m1, m2) => m1.createdAt.getTime() - m2.createdAt.getTime());

internals.setId = (message, index) => ({
    ...message, id: 89732466 + index
});

internals.markThreeRead = (message, index, arr) => ({
    ...message,
    read: (index < arr.length - 3)
});

internals.getRandom = (arr) => {

    const randomIndex = Math.floor(Math.random() * arr.length);

    return arr[randomIndex];
};
