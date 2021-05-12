const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const { initWorld } = require('./utils/worldGeneration');
const config = require('./config');
const isAuthenticated = require('./utils/auth');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const Image = require('./models/image');

const app = express();
app.use(bodyParser.json());

const path = require('path');
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, 'uploads') });
const fs = require('fs');

app.post('/api/images/', isAuthenticated, upload.single('image'), (req, res, next) => {
    if (!req.isAuth) return res.status(401).end();
    const image = new Image({
        fileName: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
    });
    return image.save()
        .then(() => {
            res.json(req.file.filename);
        });
});

app.get('/api/images/:fileName/', isAuthenticated, (req, res, next) => {
    if (!req.isAuth) return res.status(401).end();
    return Image.findOne({ fileName: req.params.fileName })
        .then((image) => {
            if (!image) return res.status(404).end();
            res.setHeader("Content-Type", image.mimetype);
            res.sendFile(image.path);
        })
        .catch(() => {
            res.end();
        });
});

app.delete('/api/images/:fileName/', isAuthenticated, (req, res, next) => {
    if (!req.isAuth) return res.status(401).end();
    return Image.findOne({ fileName: req.params.fileName })
        .then((image) => {
            if (!image) return res.status(404).end();
            return Image.deleteOne({ fileName: req.params.fileName })
                .then(() => {
                    fs.unlink(image.path, () => {
                        res.end();
                    });
                })
        })
        .catch(() => {
            res.end();
        });
});

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