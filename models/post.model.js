var db = require("../utils/db");
var nameDataBase = "webtintucdb";

module.exports = {
  add: entity => {
    return db.add("post", entity);
  },

  nextID: () => {
    return db.load(`SELECT AUTO_INCREMENT
    FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = "${nameDataBase}"
    AND TABLE_NAME = "post"`);
  },

  single: (PostID, AccID) => {
    return db.load(`SELECT * 
    FROM post 
    WHERE post.Status = 1
      AND post.Approve != 2
      AND post.PostID = ${PostID}
      AND post.AccID = ${AccID}`);
  },
  update: (id, entity) => db.update("post", "PostID", id, entity)
};
