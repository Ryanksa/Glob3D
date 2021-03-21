const World = require('./models/world');

module.exports = {
    initWorld: function(msg) {
        World.countDocuments({})
            .then(function(num) {
                if (num === 0) {
                    const terrain = [];
                    let row;
                    for (let i = 0; i < 9; i++) {
                        row = [];
                        for (let j = 0; j < 9; j++) row.push(Math.floor(Math.random() * 4));
                        terrain.push(row);
                    }
                    const world = new World({
                        terrain: terrain,
                        size: 81
                    });
                    world.save().then(function() {
                        console.log("Generated a new world");
                        console.log(msg);
                    });
                } else {
                    console.log(msg);
                }
            })
            .catch(function(err) {
                throw(err);
            });
    },
    generateTerrain: function() {
        World.findOne({})
            .then(function(world) {
                const len = Math.floor(Math.sqrt(world.size));
                const top = [];
                const bot = [];
                for (let i = 0; i < len+2; i++) {
                    top.push(Math.floor(Math.random() * 4));
                    bot.push(Math.floor(Math.random() * 4));
                }
                for (let i = 0; i < len; i++) {
                    world.terrain[i].unshift(Math.floor(Math.random() * 4));
                    world.terrain[i].push(Math.floor(Math.random() * 4));
                }
                world.terrain.unshift(top);
                world.terrain.push(bot);
                world.size = (len+2)**2;
                return world.save();
            })
            .then(function() {
                console.log("New terrain generated");
            })
            .catch(function(err) {
                throw(err);
            });
    }
};