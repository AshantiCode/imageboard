const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const multer = require('multer');
const path = require('path');
const ca = require('chalk-animation');
const s3 = require('./s3');
const uidSafe = require('uid-safe');
const config = require('./config');

const app = express();

const diskStorage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, __dirname + '/uploads');
  },
  filename: function(req, file, callback) {
    uidSafe(24).then(function(uid) {
      callback(null, uid + path.extname(file.originalname));
    });
  }
});

const uploader = multer({
  storage: diskStorage,
  limits: {
    fileSize: 2097152
  }
});

app.use(bodyParser.json());
app.use(express.static('./public'));

app.get('/', (req, res) => {
  res.redirect('/images');
});

app.get('/images', (req, res) => {
  db.getImages()
    .then(data => {
      res.json(data.rows.reverse());
    })
    .catch(err => {
      console.log('Error in get images:', err);
    });
});

app.get('/image/:id', (req, res) => {
  db.getImageInfo(req.params.id).then(results => {
    res.json(results.rows);
  });
});

app.post('/upload', uploader.single('file'), s3.upload, (req, res) => {
  db.addImage(config.s3Url + req.file.filename, req.body.username, req.body.title, req.body.description)
    .then(({ rows }) => {
      res.json(rows[0]);
    })
    .catch(err => {
      console.log('err in post upload:', err);
    });
});

app.post('/comments', (req, res) => {
  console.log('POST req.body Comments: ', req.body);
  db.addComment(req.body.comment, req.body.username, req.body.id);
});

app.listen(8080, () => ca.rainbow('Yo, I am listening on 8080'));
