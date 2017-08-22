//TODO: Test if this should be converted into a promise.

const edit = (request, reply) => {
    // then massage the fields being input, into the object. for example:
    const postId = Number(request.payload.post_id);
    
    // input acts as a schema mapper for the post.
    // it will be Object Assigned below based on valid fields in the post
    // NOTE: on the form , for consumption here, we must set the name attribute on the form.
    // for example notice that group.group_name is being set to request.payload.group_name,
    // this is because the form is serialized prior to making the ajax request.
    const input = {
        post_id: postId,
        post_subject: request.payload.post_subject,
        group: {
            group_name: request.payload.group_name
        },
        post_description: request.payload.post_description,
        post_location: request.payload.post_location
    };

    // NOTE this is asynchronous, so it should wrap everything else.
    let post = new request.server.Post(postId, (err, result) => {

        // Hoek.assert(!err, 'Problem getting Post!');
        post = result;
        Object.assign(post, input);
        post.save((err, savedPostId) => {

            // Hoek.assert(!err, 'post did not save!' + err);
            console.log('saved post id is: ' + savedPostId);

            reply.response({
                postId: postId,
                title: `Edit Post : ${postId}`,
                message: `Post ${postId} was saved successfully.`
            });
        });
    });
};

module.exports = {
    edit
}