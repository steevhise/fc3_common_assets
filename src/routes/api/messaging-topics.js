
const internals = {};

module.exports = {
    path: '/api/messaging/topics',
    method: 'GET',
    config: {
        description: 'Endpoint for retrieving all topics the logged in user is discussing (Replies)',
        tags: ['api'],
        auth: { mode: 'required' } // NOTE including this so we get the current user's id
    },
    handler: (request, reply) => {

        /*
            const { id: userId } = request.auth.credentials;
            const { messageService } = request.server;

            return messageService.fetchTopics(userId)
            .then((topics) => reply(topics));

            This would do something like fetch all threads for the given user returning them in the below format
            Which means: find threads somehow marked as including the current user
            Would it be fine to query all messages? select messages where message_from OR message_to is user_id?
            Would this work for system messages? Are those always addressed to someone? Or are there general messages, to everyone?
        */

        return reply(internals.mocks.sort((topic1, topic2) => (new Date(topic2.updatedAt).getTime()) - (new Date(topic1.updatedAt).getTime())));
    }
};

// Owning user / viewer is here defined as fc3-devtest (user_id )
// TODO Do we want to sort topics at all? I think sorting regardless of category would
// work if the frontend loops over items by type? OR we could categorize and sort here,
// shape of data could then be categories e.g. data { topics: { myPosts, theirPosts, group, system, friends } }, with each cat sorted
internals.mocks = [
    {
        topic: {
            type: 'post-mine',
            post: {
                id: 65229292,
                subject: 'Godzilla doll',
                image: null, // TODO Do we want to set a default image? Frontend / template concern? Or should this still be a request to fc3_images?
                type: {
                    typeId: 3,
                    const: 'FC_POST_WANTED',
                    name: 'WANTED'
                }
            } // TODO Do we omit irrelevant topic props e.g. user, group? or I imagine leave as null
        },
        unreadCount: 10,
        updatedAt: '2018-06-05T18:13:42.516Z' // TODO Where does this value come from? latest updated value of thread, which is latest value of a thread's messages?
    },
    {
        topic: {
            type: 'post-theirs',
            post: {
                id: 65229294,
                subject: 'A Really Long Long Title to see what the layout looks like in that case.',
                image: 'https://images.freecycle.org/posts/images/5194382',
                type: {
                    typeId: 1,
                    const: 'FC_POST_OFFER',
                    name: 'OFFER'
                }
            }
        },
        unreadCount: 0,
        updatedAt: '2018-06-03T18:13:42.516Z'
    },
    {
        topic: {
            type: 'dm',
            user: {
                id: 26619977,
                username: 'zackbrs',
                firstName: '', // These very well might not exist, as not asked for on signup
                lastName: '',
                image: 'https://images.freecycle.org/user/26619977'
            }
        },
        unreadCount: 3,
        updatedAt: '2018-06-02T18:13:42.516Z'
    },
    {
        topic: {
            type: 'system' // TODO Any other data needed for system?
        },
        unreadCount: 1,
        updatedAt: '2018-05-28T18:13:42.516Z'
    },
    {
        topic: {
            type: 'group',
            group: { // Following Fragments.BasicGroup
                id: 1014,
                name: 'Tucson',
                region: {
                    id: 5,
                    name: 'Arizona'
                },
                latitude: 31.5,
                longitude: -111
            }
        },
        unreadCount: 15,
        updatedAt: '2018-06-04T18:13:42.516Z'
    }
];
