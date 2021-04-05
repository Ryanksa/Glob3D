// terrain listeners for users to long poll updates on terrain
let terrainListeners = [];

module.exports = {
    pushTerrainListener: function(callback) {
        return new Promise(function(resolve, reject) {
            // timeout this terrain listener after 10mins
            function terrainTimeout() {
                terrainListeners.shift();
                return resolve(null);
            }
            setTimeout(terrainTimeout, 600000);

            // wrap callback in function to return promise resolve/reject
            const notify = () => {
                clearTimeout(terrainTimeout);
                callback().then(function(terrains) {
                    return resolve(terrains);
                }).catch(function(err) {
                    return reject(err);
                });
            };
            // push to terrain listeners
            terrainListeners.push(notify);
        });
    },
    runTerrainListeners: function() {
        terrainListeners.forEach((callback) => callback());
        terrainListeners = [];
    }
}