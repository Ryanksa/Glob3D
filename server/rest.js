const express = require('express');
const Image = require('./models/image');

const path = require('path');
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, 'uploads') });
const fs = require('fs');

const router = express.Router();

router.post('/images/', upload.single('image'), (req, res, next) => {
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

router.get('/images/:fileName/', (req, res, next) => {
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

router.delete('/images/:fileName/', (req, res, next) => {
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

module.exports = router;