var db = require('../utils/db');

module.exports = {
    all: ()=>{
        var sql = "select * from card";
        return db.load(sql);
    },
    single: (table,field,id) => {
        
        var sql = `select * from ${table} where ${field} = ${id}`;
        return db.load(sql);
      },
      delete: (id)=>{
          return db.delete('card','CardID',id);
      }

}