const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db.js');
const multer = require('multer');
const path = require('path');
const ca = require('chalk-animation');
const { getImages } = require('./db');
const s3 = require('./s3');

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
  getImages()
    .then(data => {
      res.json(data);
    })
    .catch(err => {
      console.log('Error in get images:', err);
    });
});

app.post('upload', uploader.single('file'), s3.upload, (req,res) => {
  db.addImage(
    req.body.title
    req.body.username
    req.body.desc
    config.s3Url + req.file.filename
  ).then(
    ({rows}) => {
      res.json(rows[0]);
    }
  )
});

app.listen(8080, () => ca.rainbow('Yo, I am listening on 8080'));
