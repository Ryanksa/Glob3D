const World = require('../../models/world');

module.exports = {
    world: function(args, { req }) {
        if (!req.isAuth) throw new Error("Unauthorized access");
        return World.findOne({})
            .then(function(world) {
                return world;
            })
            .catch(function(err) {
                throw(err);
            });
    }
};