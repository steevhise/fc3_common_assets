const Path = require('path');

const tree = require('require-dir')(null, {
    recurse: true,
    filter(abs) {

        const rel = Path.relative(__dirname, abs);

        return !rel
          .split(Path.sep)
          .some((part) => part.startsWith('helpers'));
    }
});

const flatten = (routes, obj) => {

    if (Array.isArray(obj) || (obj.path && obj.method)) {
        return routes.concat(obj);
    }

    return routes.concat(
        Object.keys(obj)
            .map((filename) => obj[filename])
            .reduce(flatten, routes)
    );
};

module.exports = flatten([], tree);
