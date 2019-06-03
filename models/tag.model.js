var db = require('../utils/db');

module.exports = {
    all: (search,limit,offset) =>{
        var sql;
        if(search === ""){
            sql = `select * from tag where tag.Status = 1  LIMIT ${limit} offset ${offset}`;
        }else{
            sql = `select * from tag where MATCH (tag.Name) AGAINST ('${search}') and tag.Status = 1  LIMIT ${limit} offset ${offset}` ;
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
        var sql = `select * from tag where MATCH (tag.Name) AGAINST ('${search}') and tag.Status = 1`;
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
    }

}