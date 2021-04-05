const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const { initWorld } = require('./utils/worldGeneration');
const config = require('./config');
const isAuthenticated = require('./utils/auth');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

const app = express();
app.use(bodyParser.json());

app.use('/graphql', isAuthenticated, graphqlHTTP((req, res) => ({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    context: { req, res }
})));

const PORT = process.env.PORT || config.port;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGO_URI || config.mongoUri)
    .then(function() {
        app.listen(PORT, function(err) {
            if (err) console.log(err);
            initWorld("Server started on port " + PORT);
        });
    })
    .catch(function(err) {
        console.log(err);
    });