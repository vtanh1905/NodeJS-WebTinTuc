var db = require("../utils/db");
var nameDataBase = "webtintucdb";

module.exports = {
  SinglePageById: id => {
    var sql = `select p.*,a.NickName from post as p ,account as a where  p.PostID = '${id}' and p.AccID 
        = a.AccID and p.Status ='1' and a.Status ='1'
        AND p.Approve = 2
        AND p.DatePost < CURRENT_TIMESTAMP()  `;
    return db.load(sql);
  },
  PostByCategogy :(CatID,limit,id)=>{
    var sql  =`select * from post where post.CatID = '${CatID}' and post.PostID != ${id} AND post.Approve = 2
    AND post.DatePost < CURRENT_TIMESTAMP()  order by post.View DESC limit ${limit}`
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
        select a.*,c.FullName,c.Avatar,c.Type,b.ComID as CmtCha,
        b.AccID as AccIDCha,b.Content as ContentCha,
        b.Date as DateCha,c1.FullName as NickNameCha,
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

  all: (Status, search, Offset, Limit) => {
    var sql;

    if (Status == "4") {
      if (search != "") {
        sql = `select p.*,a.Username,c.Name as CateName from post as p,account as a,category as c
                where p.AccID = a.AccID and MATCH (p.Title) AGAINST ('${search}') and c.CatID = p.CatID and p.Status ='1' and a.Status ='1' and c.Status ='1'
                ORDER BY p.PostID DESC LIMIT ${Offset},${Limit} `;
      } else {
        sql = `select p.*,a.Username,c.Name as CateName from post as p,account as a ,category as c
                where p.AccID = a.AccID and c.CatID = p.CatID and p.Status ='1'  and  a.Status ='1'  and  c.Status ='1'  ORDER BY p.PostID DESC
                  LIMIT ${Offset},${Limit}
                
                `;
      }
    } else if (Status == "3") {
      if (search != "") {
        sql = `select p.*,a.Username,c.Name as CateName from post as p,account as a,category as c
                where p.AccID = a.AccID and MATCH (p.Title) AGAINST ('${search}') and c.CatID = p.CatID and p.Status ='1'
                 and a.Status ='1' and c.Status ='1' AND p.DatePost > CURRENT_TIMESTAMP() and p.Approve ='2'  ORDER BY p.PostID DESC
                 LIMIT ${Offset},${Limit} `;
      } else {
        sql = `select p.*,a.Username,c.Name as CateName from post as p,account as a ,category as c
                where p.AccID = a.AccID and c.CatID = p.CatID and p.Status ='1'  and  a.Status ='1'  and  c.Status ='1'
                 AND p.DatePost > CURRENT_TIMESTAMP() and p.Approve ='2'  ORDER BY p.PostID DESC
                  LIMIT ${Offset},${Limit}
                
                `;
      }
    } else if (Status == "2") {
      if (search != "") {
        sql = `select p.*,a.Username,c.Name as CateName from post as p,account as a,category as c
                where p.AccID = a.AccID and MATCH (p.Title) AGAINST ('${search}') and c.CatID = p.CatID and p.Status ='1'
                 and a.Status ='1' and c.Status ='1' AND p.DatePost < CURRENT_TIMESTAMP() and p.Approve ='2'  ORDER BY p.PostID DESC
                 LIMIT ${Offset},${Limit} `;
      } else {
        sql = `select p.*,a.Username,c.Name as CateName from post as p,account as a ,category as c
                where p.AccID = a.AccID and c.CatID = p.CatID and p.Status ='1'  and  a.Status ='1'  and  c.Status ='1'
                AND p.DatePost < CURRENT_TIMESTAMP() and p.Approve ='2'  ORDER BY p.PostID DESC
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
                MATCH (p.Title) AGAINST ('${search}') and p.Approve ='2' and p.Status ='1'  and  a.Status ='1' AND p.DatePost > CURRENT_TIMESTAMP() `;
      } else {
        sql = `select count(*) as total  from post as p,account as a where p.AccID = a.AccID and p.Approve ='2'
                 and p.Status ='1' and  a.Status ='1' AND p.DatePost > CURRENT_TIMESTAMP()   `;
      }
    } else if (Status == "2") {
      if (search != "") {
        sql = `select count(*) as total from post as p,account as a where p.AccID = a.AccID and 
                MATCH (p.Title) AGAINST ('${search}') and p.Approve ='2' and p.Status ='1'  and  a.Status ='1' AND p.DatePost < CURRENT_TIMESTAMP() `;
      } else {
        sql = `select count(*) as total  from post as p,account as a where p.AccID = a.AccID and p.Approve ='2'
                 and p.Status ='1' and  a.Status ='1' AND p.DatePost < CURRENT_TIMESTAMP()   `;
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
  },
  allById: (Status, search, Offset, Limit,id) => {
    var sql;

    if (Status == "4") {
      if (search != "") {
        sql = `select p.*,a.Username,c.Name as CateName from post as p,account as a,category as c
                where p.AccID = a.AccID and MATCH (p.Title) AGAINST ('${search}') and c.CatID = p.CatID and p.Status ='1' and a.Status ='1' and c.Status ='1'
                and p.AccID = '${id}' ORDER BY p.PostID DESC  LIMIT ${Offset},${Limit}`;
      } else {
        sql = `select p.*,a.Username,c.Name as CateName from post as p,account as a ,category as c
                where p.AccID = a.AccID and p.AccID = '${id}' and c.CatID = p.CatID and p.Status ='1'  and  a.Status ='1'  and  c.Status ='1' ORDER BY p.PostID DESC  
                  LIMIT ${Offset},${Limit} 
                
                `;
      }
    } else if (Status == "3") {
      if (search != "") {
        sql = `select p.*,a.Username,c.Name as CateName from post as p,account as a,category as c
                where p.AccID = a.AccID and p.AccID = '${id}' and MATCH (p.Title) AGAINST ('${search}') and c.CatID = p.CatID and p.Status ='1'
                 and a.Status ='1' and c.Status ='1' AND p.DatePost > CURRENT_TIMESTAMP() and p.Approve ='2' ORDER BY p.PostID DESC  
                 LIMIT ${Offset},${Limit} `;
      } else {
        sql = `select p.*,a.Username,c.Name as CateName from post as p,account as a ,category as c
                where p.AccID = a.AccID and p.AccID = '${id}' and c.CatID = p.CatID and p.Status ='1'  and  a.Status ='1'  and  c.Status ='1'
                AND p.DatePost > CURRENT_TIMESTAMP() and p.Approve ='2' ORDER BY p.PostID DESC  
                  LIMIT ${Offset},${Limit}
                
                `;
      }
    } else if (Status == "2") {
      if (search != "") {
        sql = `select p.*,a.Username,c.Name as CateName from post as p,account as a,category as c
                where p.AccID = a.AccID and p.AccID = '${id}' and MATCH (p.Title) AGAINST ('${search}') and c.CatID = p.CatID and p.Status ='1'
                 and a.Status ='1' and c.Status ='1' AND p.DatePost < CURRENT_TIMESTAMP() and p.Approve ='2' ORDER BY p.PostID DESC  
                 LIMIT ${Offset},${Limit} `;
      } else {
        sql = `select p.*,a.Username,c.Name as CateName from post as p,account as a ,category as c
                where p.AccID = a.AccID and p.AccID = '${id}' and c.CatID = p.CatID and p.Status ='1'  and  a.Status ='1'  and  c.Status ='1'
                AND p.DatePost < CURRENT_TIMESTAMP() and p.Approve ='2' ORDER BY p.PostID DESC  
                  LIMIT ${Offset},${Limit}
                
                `;
      }
    } else {
      if (search != "") {
        sql = `select p.*,a.Username,c.Name as CateName from post as p,account as a ,category as c
                where p.AccID = a.AccID and p.AccID = '${id}' and MATCH (p.Title) AGAINST ('${search}') and p.Approve ='${Status}' and c.CatID = p.CatID
                and p.Status ='1' and c.Status ='1' and a.Status ='1'  LIMIT ${Offset},${Limit}
                `;
      } else {
        sql = `select p.*,a.Username,c.Name as CateName from post as p,account as a ,category as c
                where p.AccID = a.AccID and p.AccID = '${id}' and p.Approve ='${Status}' and c.CatID = p.CatID 
                and  p.Status ='1'  and  a.Status ='1'  and  c.Status ='1'
                LIMIT ${Offset},${Limit} `;
      }
    }
    return db.load(sql);
  },
  CountallById: (Status, search,id) => {
    var sql;

    if (Status == "4") {
      if (search != "") {
        sql = `select count(*) as total  from post as p,account as a where p.AccID = a.AccID and p.AccID = '${id}' and 
                MATCH (p.Title) AGAINST ('${search}') and p.Status ='1'  and  a.Status ='1' `;
      } else {
        sql = `select count(*) as total  from post as p,account as a where p.AccID = a.AccID and p.AccID = '${id}' and p.Status ='1'
                and  a.Status ='1'  `;
      }
    } else if (Status == "3") {
      if (search != "") {
        sql = `select count(*) as total from post as p,account as a where p.AccID = a.AccID and p.AccID = '${id}' and 
                MATCH (p.Title) AGAINST ('${search}') and p.Approve ='2' and p.Status ='1'  and  a.Status ='1' and  p.DatePost > CURRENT_TIMESTAMP() `;
      } else {
        sql = `select count(*) as total  from post as p,account as a where p.AccID = a.AccID and p.AccID = '${id}' and p.Approve ='2'
                 and p.Status ='1' and  a.Status ='1' and  p.DatePost > CURRENT_TIMESTAMP()   `;
      }
    } else if (Status == "2") {
      if (search != "") {
        sql = `select count(*) as total from post as p,account as a where p.AccID = a.AccID and p.AccID = '${id}' and 
                MATCH (p.Title) AGAINST ('${search}') and p.Approve ='2' and p.Status ='1'  and  a.Status ='1' and  p.DatePost < CURRENT_TIMESTAMP()  `;
      } else {
        sql = `select count(*) as total  from post as p,account as a where p.AccID = a.AccID and p.AccID = '${id}' and p.Approve ='2'
                 and p.Status ='1' and  a.Status ='1' and  p.DatePost < CURRENT_TIMESTAMP()  `;
      }
    } else {
      if (search != "") {
        sql = `select count(*) as total from post as p,account as a where p.AccID = a.AccID and p.AccID = '${id}' and 
                p.Approve ='${Status}' and MATCH (p.Title) AGAINST ('${search}') and p.Status ='1'and  a.Status ='1' `;
      } else {
        sql = `select count(*) as total from post as p,account as a where p.AccID = a.AccID and p.AccID = '${id}' and 
                p.Approve ='${Status}' and p.Status ='1' and  a.Status ='1' `;
      }
    }
    return db.load(sql);
  },
  AllByCatID: (search, Offset, Limit,array) => {
    var sql ;

      if (search != "") {
        sql = `select p.*,a.Username,a.NickName,c.* from post as p,account as a ,category as c
                where p.AccID = a.AccID and MATCH (p.Title) AGAINST ('${search}') and p.Approve ='1' and 
                c.CatID = p.CatID and p.CatID in (${array})
                and p.Status ='1' and c.Status ='1' and a.Status ='1'  ORDER BY p.PostID DESC  LIMIT ${Offset},${Limit}
                `;
      } else {
        sql = `select p.*,a.Username,a.NickName,c.* from post as p,account as a ,category as c
                where p.AccID = a.AccID and p.Approve ='1' and c.CatID = p.CatID and p.CatID in (${array})
                and  p.Status ='1'  and  a.Status ='1'   and  c.Status ='1'  ORDER BY p.PostID DESC
                LIMIT ${Offset},${Limit} `;
    }
    return db.load(sql);
  },
  CountAllByCatID: (search,array) => {
    var sql;

      if (search != "") {
        sql = `select count(*) as total from post as p,account as a ,category as c
                where p.AccID = a.AccID and MATCH (p.Title) AGAINST ('${search}') and p.Approve ='1' and 
                c.CatID = p.CatID and p.CatID in (${array})
                and p.Status ='1' and c.Status ='1' and a.Status ='1'
                `;
      } else {
        sql = ` select  count(*) as total from post as p,account as a ,category as c
        where p.AccID = a.AccID and p.Approve ='1' and c.CatID = p.CatID and p.CatID in (${array})
        and  p.Status ='1'  and  a.Status ='1'  and  c.Status ='1' `;
    }
    return db.load(sql);
  },
  AllCatInArr: (array) =>{
    var sql = `select c.* from category as c where c.CatID in (${array}) `;
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
  },
  getNewPosts: offset => {
    return db.load(`SELECT post.PostID, post.Title, post.URLImage, post.DatePost, post.Abstract, post.ListTagID, post.isPremium, category.Name as 'CatName', category.CatID, account.NickName
    FROM post 
    LEFT JOIN category ON post.CatID = category.CatID
    LEFT JOIN account ON post.AccID = account.AccID
    WHERE post.Status = 1
      AND post.Approve = 2
      AND post.DatePost < CURRENT_TIMESTAMP() 
    ORDER BY post.DatePost DESC, post.isPremium DESC
    LIMIT 10 OFFSET ${offset}`);
  },
  allWithPaging: (CatID, isCatParent, limit, offset) => {
    return db.load(`SELECT post.PostID,
    post.Title,
    post.URLImage,
    post.DatePost,
    post.Abstract,
    post.ListTagID,
    post.isPremium,
    category.Name AS 'CatName',
    category.CatID,
    account.NickName 
    FROM post , category , account 
    WHERE post.CatID = category.CatID 
    AND ((category.CatParent = ${CatID} or 0=${isCatParent})  or post.CatID = ${CatID})
    AND post.AccID = account.AccID 
    AND post.Status = 1 
    AND post.Approve = 2 
    AND post.DatePost < CURRENT_TIMESTAMP()
    AND (post.CatID = ${CatID} or 1=${isCatParent})
    ORDER BY post.DatePost DESC , post.isPremium DESC
    LIMIT ${limit} OFFSET ${offset}`);
  },

  countAllWithPaging: (CatID, isCatParent) => {
    return db.load(`SELECT count(*) as 'TotalPost'
    FROM post , category , account 
    WHERE post.CatID = category.CatID 
    AND (category.CatParent = ${CatID} or 0=${isCatParent})
    AND post.AccID = account.AccID 
    AND post.Status = 1 
    AND post.Approve = 2 
    AND post.DatePost < CURRENT_TIMESTAMP()
    AND (post.CatID = ${CatID} or 1=${isCatParent})`);
  },
  allWithTagIDPaging : (TagID, limit, offset) =>{
    return db.load(`SELECT post.PostID,
    post.Title,
    post.URLImage,
    post.DatePost,
    post.Abstract,
    post.ListTagID,
    post.isPremium,
    category.Name AS 'CatName',
    category.CatID,
    account.NickName 
    FROM post 
    LEFT JOIN category ON post.CatID = category.CatID 
    LEFT JOIN account ON post.AccID = account.AccID 
    WHERE post.Status = 1
    AND post.Approve = 2
    AND post.DatePost < CURRENT_TIMESTAMP()
    AND FIND_IN_SET('${TagID}', post.ListTagID)
    ORDER BY post.DatePost DESC, post.isPremium DESC
    LIMIT ${limit} OFFSET ${offset}`);
  },
  countAllWithTagIDPaging : (TagID) =>{
    return db.load(`SELECT count(*) as 'TotalPost'
    FROM post 
    LEFT JOIN category ON post.CatID = category.CatID 
    LEFT JOIN account ON post.AccID = account.AccID 
    WHERE post.Status = 1
    AND post.Approve = 2
    AND post.DatePost < CURRENT_TIMESTAMP()
    AND FIND_IN_SET('${TagID}', post.ListTagID)`);
  },
  allWithSearchPaging : (StringSearch, limit, offset) =>{
    return db.load(`SELECT post.PostID,
    post.Title,
    post.URLImage,
    post.DatePost,
    post.Abstract,
    post.ListTagID,
    post.isPremium,
    category.Name AS 'CatName',
    category.CatID,
    account.NickName 
    FROM post 
    LEFT JOIN category ON post.CatID = category.CatID 
    LEFT JOIN account ON post.AccID = account.AccID 
    WHERE post.Status = 1
    AND post.Approve = 2
    AND post.DatePost < CURRENT_TIMESTAMP()
    AND MATCH (post.Title, post.Abstract) AGAINST ('${StringSearch}')
    ORDER BY post.DatePost DESC, post.isPremium DESC
    LIMIT ${limit} OFFSET ${offset}`);
  },
  countAllWithSearchPaging : (StringSearch) =>{
    return db.load(`SELECT count(*) as 'TotalPost'
    FROM post 
    LEFT JOIN category ON post.CatID = category.CatID 
    LEFT JOIN account ON post.AccID = account.AccID 
    WHERE post.Status = 1
    AND post.Approve = 2
    AND post.DatePost < CURRENT_TIMESTAMP()
    AND MATCH (post.Title, post.Abstract) AGAINST ('${StringSearch}')`);
  },
  singleWithPostID : (PostID) =>{
    return db.load(`SELECT * 
        FROM post 
        WHERE post.Status = 1
          AND post.PostID = ${PostID}`);
  },
  getFiveNewHot: ()=>{
    return db.load(`SELECT * 
    FROM webtintucdb.post 
    where status = 1 and post.Approve = 2 and post.DatePost < CURRENT_TIMESTAMP()
    order by  post.View desc, post.isPremium desc
    limit 0,5`);
  },
  getFourImpressPost: ()=>{
    return db.load(`
    SELECT * , category.Name as CatName, account.NickName as NickName
    FROM post
    Left JOIN category ON post.CatID = category.CatID and category.Status = 1
    Left JOIN account ON post.AccID = account.AccID and account.Status = 1 
    where post.status = 1 and post.Approve = 2 and post.DatePost > DATE_ADD(now(), INTERVAL(-WEEKDAY(now())) DAY) and post.DatePost < now()
    order by  post.View desc, post.isPremium desc
    limit 0,4`);
  },
  getTop10Post: ()=>{
    return db.load(`SELECT *, category.Name as CatName, account.NickName as NickName
    FROM post
    Left JOIN category ON post.CatID = category.CatID and category.Status = 1
    Left JOIN account ON post.AccID = account.AccID and account.Status = 1 
    where post.status = 1 and post.Approve = 2 and post.DatePost < CURRENT_TIMESTAMP()
    order by  post.View desc, post.isPremium desc
    limit 0,11`);
  },
  getNewestPostPerCat : ()=>{
    return db.load(`SELECT *, category.Name as CatName, account.NickName as NickName
    FROM post
    Left JOIN category ON post.CatID = category.CatID and category.Status = 1 
    Left JOIN account ON post.AccID = account.AccID and account.Status = 1
    where post.status = 1 and post.Approve = 2 and post.DatePost < CURRENT_TIMESTAMP()
    group by post.CatID
    having max(DatePost) 
    order by post.View desc, post.isPremium desc
    limit 0,10`);
  }


};
