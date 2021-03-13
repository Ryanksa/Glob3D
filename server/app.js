const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const config = require('./config');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');

const app = express();
app.use(bodyParser.json());

let isAuthenticated = function(req, res, next) {
    req.isAuth = false;

    // extract jsonwebtoken from cookie
    const cookies = cookie.parse(req.headers.cookie || "");
    if (!cookies.token) return next();

    // verify jsonwebtoken
    const decodedToken = jwt.verify(cookies.token, config.jwtSecret);
    if (!decodedToken) return next();

    // authentication successful, update request fields
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
};

app.use('/graphql', isAuthenticated, graphqlHTTP((req, res) => ({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    context: { req, res }, 
    graphiql: true
})));


const mongoose = require('mongoose');
const PORT = process.env.PORT || config.port;

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.MONGO_URI || config.mongoUri)
    .then(function() {
        app.listen(PORT, function(err) {
            if (err) console.log(err);
            else console.log("Server started on port %s", PORT);
        });
    })
    .catch(function(err) {
        console.log(err);
    });