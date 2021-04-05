const World = require('../../models/world');
const { pushTerrainListener } = require('../../listeners/terrainListeners');

module.exports = {
    world: function({ long }, { req, res }) {
        if (!req.isAuth) {
            res.status(401);
            throw new Error("Unauthorized access");
        }
        const getWorld = () => {
            return World.findOne({})
                .then(function(world) {
                    return world;
                })
                .catch(function(err) {
                    throw(err);
                });
        };
        if (!long) {
            return getWorld();
        } else {
            return pushTerrainListener(getWorld)
                .then(function(world) {
                    return world;
                })
                .catch(function(err) {
                    throw err;
                });
        }
    }
};