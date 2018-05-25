const Constants = require('@freecycle/common-hapi-plugins/constants');
const Hoek = require('hoek');
const ImageUtils = require('@freecycle/common-hapi-plugins/services/images');

exports.formFailAction = (request, reply, source, error) => {

    if (source !== 'payload') {
        return reply(error);
    }

    const validation = {
        error,
        info: error.data.details.map(({ message, path }) => ({ message, path, type: 'form' }))
    };

    request[source] = Object.assign(request[source] || {}, { validation });
    request.app.formValidation = (request.app.formValidation || []).concat(validation.info);

    return reply.continue();
};

exports.validateImagesPre = (request, reply) => {

    if (!request.payload || !request.payload.images) {
        return reply.continue();
    }

    const { images } = request.payload;
    return Promise.all(images.map((img) => ImageUtils.validate(img)))
    .catch((err) => {

        request.app.formValidation = request.app.formValidation || [];
        request.app.formValidation.push({
            type: 'form',
            path: 'image',
            message: err.message
        });

        return;
    })
    .then(() => {

        return reply.continue();
    });
};

// { A: true } -> { A: 'A' }
exports.keyMirror = (obj) => {

    return Object.keys(obj).reduce((scopes, key) => ({
        //...scopes,
        [key]: key
    }), {});
};

exports.groupMembershipStatus = (request, groupId) => {

    const { userService } = request.server;
    const { credentials, isAuthenticated } = request.auth;

    Hoek.assert(groupId, 'groupMembershipStatus requires a group id');

    const membershipChecks = {
        isMember: false,
        isPending: false,
        membershipLimitReached: false
    };

    if (!isAuthenticated) {
        return Promise.resolve(membershipChecks);
    }

    return userService.fetchTownMemberships(credentials.id, true)
    .then((memberships) => {

        membershipChecks.isMember = Hoek.contain(memberships, [{ id: groupId, isPending: 0 }], { deep: true });
        membershipChecks.isPending = Hoek.contain(memberships, [{ id: groupId, isPending: 1 }], { deep: true });

        // We count only approved memberships toward the limit.
        // TODO Make sure to prevent multiple pending memberships from exceeding this limit on the moderation side
        membershipChecks.membershipLimitReached = memberships.filter((memb) => memb.isPending === 0).length === Constants.MAX_GROUPS;

        return membershipChecks;
    });
};

// NOTE Assumes route has a uniqueName param representing group's id or yahoo_group_name
exports.groupNotFound = (request, reply, opts = { pre: false }) => {

    reply.state('redirectedError', {
        message: 'Sorry, we couldn\'t find that group. Try searching!',
        path: request.route.path.replace(/{uniqueName\??}/, request.params.uniqueName),
        type: 'groupNotFound'
    });

    if (opts.pre) {
        return reply.redirect('/find-towns').temporary().takeover();
    }

    return reply.redirect('/find-towns').temporary();
};

// NOTE Assumes route has a uniqueName param representing group's id or yahoo_group_name
exports.groupDetailPre = {
    assign: 'groupDetail',
    method: (request, reply) => {

        const { groupService } = request.server;
        const { uniqueName } = request.params;

        groupService.fetchByIdentifier(uniqueName)
        .then((group) => { // A null group (not found) is fine; check for that in the handler

            if (!group) {
                return exports.groupNotFound(request, reply, { pre: true });
            }

            return exports.groupMembershipStatus(request, group.group_id)
            .then((membershipChecks) => reply({ membershipChecks, group }));
        });
    }
};
