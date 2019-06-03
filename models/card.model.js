var db = require('../utils/db');

module.exports = {
    all: () => {
        var sql = `select * from card as c where c.Check = 0 and c.Status =1 `;
        return db.load(sql);
    },
    alloffset: (limit, offset, search, produce) => {
        var sql;
    
        
        if (search === "" && produce === "") {
            sql = `select c.*,a.Username from card as c,account as a where c.AccID = a.AccID and c.Check =0 and c.Status =1  LIMIT ${limit} offset ${offset}`;
        } else if (search != "" && produce != "") {
            if (produce === 'tat-ca') {
              
                 sql = `select c.*,a.Username from card as c,account as a where '${search}' = a.Username and a.AccID = c.AccID and c.Check =0 and c.Status =1  LIMIT ${limit} offset ${offset}`;
            } else {
                
                sql = `select c.*,a.Username from card as c,account as a where c.ProductBy='${produce}' and '${search}' = a.Username and a.AccID = c.AccID and c.Check =0 and c.Status =1  LIMIT ${limit} offset ${offset}`;
            }

        } else if (produce != "" && search === "") {
            console.log('Tim tren produce');
            if (produce === 'tat-ca') {
                sql = `select c.*,a.Username from card as c,account as a where c.AccID = a.AccID and c.Check =0 and c.Status =1  LIMIT ${limit} offset ${offset}`;
            } else {
              
                 sql = `select c.*,a.Username from card as c,account as a where c.ProductBy = '${produce}' and a.AccID = c.AccID and c.Check =0 and c.Status =1  LIMIT ${limit} offset ${offset}`;
            }
        }
        return db.load(sql);
    },
    single: (table, field, id) => {

        var sql = `select * from ${table} where ${field} = ${id}`;
        return db.load(sql);
    },
    delete: (id,entity) => {
        return db.update('card','CardID',id,entity);
    },
    countAll: (search, produce) => {
        var sql;
        if (search === "" && produce === "") {
            sql = `select count(*) as total from card as c where c.Check =0 and c.Status =1`;
        } else if (search != "" && produce != "") {
            if (produce === 'tat-ca') {
               
                sql = `select count(*) as total from card as c,account as a where '${search}' = a.Username and a.AccID = c.AccID and c.Check =0 and c.Status =1 `;
            } else {
               
                sql = `select count(*) as total from card as c,account as a where c.ProductBy='${produce}' and '${search}' = a.Username and a.AccID = c.AccID  and c.Check =0 and c.Status =1`;
            }
        } else if (produce != "" && search == "") {
            console.log('Tim duoi produce');
            if (produce === 'tat-ca') {
                sql = `select  count(*) from card as c where c.Check =0 and c.Status =1`;
            } else {
               
                 sql = `select  count(*) from card as c where c.ProductBy='${produce} and c.Check =0 and c.Status =1' `;
            }
        }
        return db.load(sql);
    },
}