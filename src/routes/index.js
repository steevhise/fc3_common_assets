const routesByFile = require('require-dir')(__dirname);

module.exports = [].concat(...Object.values(routesByFile));
