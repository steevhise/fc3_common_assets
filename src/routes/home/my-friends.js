
module.exports = {
    method: 'GET',
    path: '/home/my-friends',
    config: {
        id: 'home_myfriends',
        description: 'The logged in user\'s friends list.',
        auth:  { mode: 'required' }
    },
    handler: function (request, reply) {

        const { id: userId } = request.auth.credentials;
        const { userService } = request.server;

        return userService.fetchFriends(userId)
        .then((friends) => {

            const mocks = [
                {
                    firstName: 'Garth',
                    lastName: 'Angers',
                    image: 'http://lorempixel.com/150/150/people/5',
                    username: 'countrythunder2015'
                },
                {
                    firstName:'Deron',
                    lastName: 'Beal',
                    image: 'http://lorempixel.com/150/150/people/1',
                    username: 'deronbeal'
                },
                {
                    firstName: 'Steev',
                    lastName: 'Hise',
                    image: 'http://lorempixel.com/150/150/people/2',
                    username: 'steevhise'
                },
                {
                    firstName: 'Nguyet',
                    lastName: 'Aleshire',
                    image: 'http://lorempixel.com/150/150/people/3',
                    username: 'nuggeti'
                },
                {
                    firstName: 'Dominick',
                    lastName: 'Amundson',
                    image: 'http://lorempixel.com/150/150/people/4',
                    username: 'stayingalive'
                },
                {
                    firstName: 'Dominick2',
                    lastName: 'Amundson2',
                    image: 'http://lorempixel.com/150/150/people/4',
                    username: 'stayingalive2'
                },
                {
                    firstName: 'Dominick3',
                    lastName: 'Amundson3',
                    image: 'http://lorempixel.com/150/150/people/4',
                    username: 'stayingalive3'
                },
                {
                    firstName: 'Dominick4',
                    lastName: 'Amundson4',
                    image: 'http://lorempixel.com/150/150/people/4',
                    username: 'stayingalive4'
                },
                {
                    firstName: 'Tiffaney',
                    lastName: 'August',
                    image: 'http://lorempixel.com/150/150/people/6',
                    username: 'augustsummer'
                },
                {
                    firstName: 'Ronny',
                    lastName: 'Bartkowiak',
                    image: 'http://lorempixel.com/150/150/people/7',
                    username: 'ronnnnnnnny'
                }
            ];

            friends = friends.concat(mocks);

            reply.view('home/my_friends', {
                data: {
                    friends
                },
                inBodyAds: [
                    'one',
                    'two'
                ]
            });
        });
    }
};
