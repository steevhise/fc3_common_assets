/**
 * The Action Models are used to control the actions route methods.
 * This allows us to breakout each api call into modular directories for better control and extendability.
 * NOTE: All modules must be required, and exported here in order to be consumed in the actions route.
 */

const post = require('./post');

module.exports = {
    post_edit : post.edit
}