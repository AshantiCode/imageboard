const spicedPg = require('spiced-pg');
const { dbUser, dbPass } = require('./secrets');

db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/imageboard`);

// GET IMAGES
module.exports.getImages = () => {
  return db
    .query(
      `
        SELECT * FROM images
    `
    )
    .catch(err => {
      console.log('Err in db.getImages:', err);
    });
};

//ADD /UPLOAD IMAGES
module.exports.addImage = (url, username, title, description) => {
  return db.query(`INSERT INTO images (url, username, title, description) VALUES ($1, $2, $3, $4) RETURNING *`, [
    url,
    username,
    title,
    description
  ]);
};

module.exports.getImageInfo = id => {
  return db.query(`SELECT * FROM images WHERE id = $1`, [id]);
};

// ADD  COMMENT
module.exports.addComment = (comment, username, image_id) => {
  return db.query(`INSERT INTO comments (comment, username, image_id) VALUES ($1, $2, $3)`, [
    comment,
    username,
    image_id
  ]);
};
