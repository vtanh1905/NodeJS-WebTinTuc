var db = require('../utils/db');

module.exports = {
    all: (search,limit,offset) =>{
        var sql;
        if(search === ""){
            sql = `select * from tag where tag.Status = 1  LIMIT ${offset},${limit}`;
        }else{
            sql = `select * from tag where MATCH (tag.Name) AGAINST ('${search}') and tag.Status = 1  LIMIT ${offset},${limit}` ;
        }
        return db.load(sql);
    },
    countAll: (search) =>{
        var sql;
        if(search === ""){
            sql = `select count(*) as total from tag where tag.Status = 1 `;
        }else{
            sql = `select count(*) as total from tag  WHERE MATCH (tag.Name) AGAINST ('${search}') and tag.Status = 1`;
        }
        return db.load(sql);
    },
    SingleByName: (name)=>{
        var sql = `select * from tag where MATCH (tag.Name) AGAINST ('${name}') and tag.Status = 1`;
        return db.load(sql);
    },
    SingleById: (id)=>{
        var sql = `select * from tag where TagID='${id}' and tag.Status = 1`;
        return db.load(sql);
    },
    update: (id,entity)=>{
        return db.update('tag','TagID',id,entity);
    },
    delete: (id,entity)=>{
        return db.update('tag','TagID',id,entity);
    },
    add : (entity)=>{
        return db.add('tag',entity);
    },
    getAll : () => db.load(`select * from tag where tag.Status = 1`),
    mutiAdd: (arr) =>{
        var sql = `INSERT INTO tag (Name, Status) VALUES `;
        sql += `("${arr[0]}", 1)`;
        for (let index = 1; index < arr.length; index++) {
            sql += `,("${arr[index]}", 1)`;
        }
        return db.load(sql);
    }
}