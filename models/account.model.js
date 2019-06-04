var db = require("../utils/db");
var nameDataBase = "webtintucdb";

module.exports = {
  add: entity => db.add("account", entity),
  nextID: () =>
    db.load(`SELECT AUTO_INCREMENT
  FROM information_schema.TABLES
  WHERE TABLE_SCHEMA = "${nameDataBase}"
  AND TABLE_NAME = "account"`),
  allWithPostsFSP: (type, search, page, offset) => {
    if (type < 0) {
      return db.load(`SELECT account.AccID,
    account.Username,
    account.FullName,
    account.Email,
    account.Type,
    COUNT ( post.PostID ) AS 'cPosts' 
    FROM account 
    LEFT JOIN POST ON account.AccID = POST.AccID 
    WHERE account.Username like '%${search}%'
    AND account.Status = 1
    GROUP BY account.AccID , account.Username , account.FullName , account.Email , account.Type 
    LIMIT ${page} OFFSET ${offset}`);
    } else {
      return db.load(`SELECT account.AccID,
    account.Username,
    account.FullName,
    account.Email,
    account.Type,
    COUNT ( post.PostID ) AS 'cPosts' 
    FROM account 
    LEFT JOIN POST ON account.AccID = POST.AccID 
    WHERE account.Username like '%${search}%'
    AND account.Type = ${type}
    AND account.Status = 1
    GROUP BY account.AccID , account.Username , account.FullName , account.Email , account.Type 
    LIMIT ${page} OFFSET ${offset}`);
    }
  },
  countAll: search => {
    var sql;
    if (search === "") {
      sql = `select count(*) as total from account where account.Status = 1 `;
    } else {
      sql = `select count(*) as total from account  WHERE account.Username like '%${search}%' and tag.Status = 1`;
    }
    return db.load(sql);
  },
  singleByUsername: username =>
    db.load(`SELECT * FROM account WHERE Username = "${username}"`),
  singleByUsernameStatus: username =>
    db.load(
      `SELECT * FROM account WHERE Username = "${username}" AND Status = 1`
    ),
  single: id => db.load(`SELECT * FROM account WHERE AccID = ${id}`),
  update: (id, entity) => db.update("account", "AccID", id, entity),
  delete: id => db.delete("account", "AccID", id)
};
