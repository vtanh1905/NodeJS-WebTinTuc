var db = require("../utils/db");
var nameDataBase = "webtintucdb";

module.exports = {
  SinglePageById: id => {
    var sql = `select p.*,a.NickName from post as p ,account as a where  p.PostID = '${id}' and p.AccID 
        = a.AccID and p.Status ='1' and a.Status ='1' `;
    return db.load(sql);
  },
  AllTag: arr => {
    var sql = `select * from tag as t  where t.TagID in (${arr}) and t.Status ='1' `;
    return db.load(sql);
  },
  update: (id, entity) => {
    return db.update("post", "postID", id, entity);
  },
  AllComt: arr => {
    var sql = `
        select a.*,c.NickName,c.Avatar,c.Type,b.ComID as CmtCha,
        b.AccID as AccIDCha,b.Content as ContentCha,
        b.Date as DateCha,c1.NickName as NickNameCha,
        c1.Avatar as AvatarCha,c1.Type as TypeCha from  comment as a
        inner join account as c on a.ComID in (${arr}) and a.AccID= c.AccID and a.Status ='1'
        left  join comment as b on a.ComParent = b.ComID and b.Status ='1'
        left join account as c1 on b.AccId = c1.accID and c1.Status ='1'
        `;
    return db.load(sql);
  },
  add: entity => {
    return db.add("post", entity);
  },

  all: (Status, search, Offset, Limit, KyHieuSoSanh) => {
    var sql;

    if (Status == "4") {
      if (search != "") {
        sql = `select p.*,a.Username,c.Name as CateName from post as p,account as a,category as c
                where p.AccID = a.AccID and MATCH (p.Title) AGAINST ('${search}') and c.CatID = p.CatID and p.Status ='1' and a.Status ='1' and c.Status ='1'
                 LIMIT ${Offset},${Limit} `;
      } else {
        sql = `select p.*,a.Username,c.Name as CateName from post as p,account as a ,category as c
                where p.AccID = a.AccID and c.CatID = p.CatID and p.Status ='1'  and  a.Status ='1'  and  c.Status ='1'
                  LIMIT ${Offset},${Limit}
                
                `;
      }
    } else if (Status == "3") {
      if (search != "") {
        sql = `select p.*,a.Username,c.Name as CateName from post as p,account as a,category as c
                where p.AccID = a.AccID and MATCH (p.Title) AGAINST ('${search}') and c.CatID = p.CatID and p.Status ='1'
                 and a.Status ='1' and c.Status ='1' and p.DatePost >now() and p.Approve ='2'
                 LIMIT ${Offset},${Limit} `;
      } else {
        sql = `select p.*,a.Username,c.Name as CateName from post as p,account as a ,category as c
                where p.AccID = a.AccID and c.CatID = p.CatID and p.Status ='1'  and  a.Status ='1'  and  c.Status ='1'
                and p.DatePost >now() and p.Approve ='2'
                  LIMIT ${Offset},${Limit}
                
                `;
      }
    } else if (Status == "2") {
      if (search != "") {
        sql = `select p.*,a.Username,c.Name as CateName from post as p,account as a,category as c
                where p.AccID = a.AccID and MATCH (p.Title) AGAINST ('${search}') and c.CatID = p.CatID and p.Status ='1'
                 and a.Status ='1' and c.Status ='1' and p.DatePost < now() and p.Approve ='2'
                 LIMIT ${Offset},${Limit} `;
      } else {
        sql = `select p.*,a.Username,c.Name as CateName from post as p,account as a ,category as c
                where p.AccID = a.AccID and c.CatID = p.CatID and p.Status ='1'  and  a.Status ='1'  and  c.Status ='1'
                and p.DatePost < now() and p.Approve ='2'
                  LIMIT ${Offset},${Limit}
                
                `;
      }
    } else {
      if (search != "") {
        sql = `select p.*,a.Username,c.Name as CateName from post as p,account as a ,category as c
                where p.AccID = a.AccID and MATCH (p.Title) AGAINST ('${search}') and p.Approve ='${Status}' and c.CatID = p.CatID
                and p.Status ='1' and c.Status ='1' and a.Status ='1'  LIMIT ${Offset},${Limit}
                `;
      } else {
        sql = `select p.*,a.Username,c.Name as CateName from post as p,account as a ,category as c
                where p.AccID = a.AccID and p.Approve ='${Status}' and c.CatID = p.CatID 
                and  p.Status ='1'  and  a.Status ='1'  and  c.Status ='1'
                LIMIT ${Offset},${Limit} `;
      }
    }
    return db.load(sql);
  },
  Countall: (Status, search) => {
    var sql;

    if (Status == "4") {
      if (search != "") {
        sql = `select count(*) as total  from post as p,account as a where p.AccID = a.AccID and 
                MATCH (p.Title) AGAINST ('${search}') and p.Status ='1'  and  a.Status ='1' `;
      } else {
        sql = `select count(*) as total  from post as p,account as a where p.AccID = a.AccID and p.Status ='1'
                and  a.Status ='1'  `;
      }
    } else if (Status == "3") {
      if (search != "") {
        sql = `select count(*) as total from post as p,account as a where p.AccID = a.AccID and 
                MATCH (p.Title) AGAINST ('${search}') and p.Approve ='2' and p.Status ='1'  and  a.Status ='1' and p.DatePost >now()  `;
      } else {
        sql = `select count(*) as total  from post as p,account as a where p.AccID = a.AccID and p.Approve ='2'
                 and p.Status ='1' and  a.Status ='1' and p.DatePost >now()   `;
      }
    } else if (Status == "2") {
      if (search != "") {
        sql = `select count(*) as total from post as p,account as a where p.AccID = a.AccID and 
                MATCH (p.Title) AGAINST ('${search}') and p.Approve ='2' and p.Status ='1'  and  a.Status ='1' and p.DatePost < now()  `;
      } else {
        sql = `select count(*) as total  from post as p,account as a where p.AccID = a.AccID and p.Approve ='2'
                 and p.Status ='1' and  a.Status ='1' and p.DatePost < now()   `;
      }
    } else {
      if (search != "") {
        sql = `select count(*) as total from post as p,account as a where p.AccID = a.AccID and 
                p.Approve ='${Status}' and MATCH (p.Title) AGAINST ('${search}') and p.Status ='1'and  a.Status ='1' `;
      } else {
        sql = `select count(*) as total from post as p,account as a where p.AccID = a.AccID and 
                p.Approve ='${Status}' and p.Status ='1' and  a.Status ='1' `;
      }
    }
    return db.load(sql);
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
  }
};
