var db = require("../utils/db");
var nameDataBase = "webtintucdb";

module.exports = {
  add: entity => {
    return db.add("post", entity);
  },
  nextID: () =>
    db.load(`SELECT AUTO_INCREMENT
  FROM information_schema.TABLES
  WHERE TABLE_SCHEMA = "${nameDataBase}"
  AND TABLE_NAME = "post"`)
};
