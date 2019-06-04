var mysql      = require('mysql');

createConnection = () => mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "webtintucdb"
});

module.exports = {
    load : (sql) => new Promise((resolve, reject) => {
        var connection = createConnection();
        connection.connect();
        connection.query(sql, function (error, results, fields) {
          if (error){
            reject(error);
          } else{
            resolve(results);
          };
        }); 
        connection.end();
    }),
    
    add : (tableName, entity) => new Promise((resolve, reject) => {
        var connection = createConnection();
        connection.connect();
        connection.query(`INSERT INTO ${tableName} SET ?`, entity, function (error, results, fields) {
          if (error){
            reject(error);
          } else{
            resolve(results.insertId);
          };
        }); 
        connection.end();
    }),

    update : (tableName, idField, id, entity) => new Promise((resolve, reject) => {
        var connection = createConnection();
        connection.connect();
        delete entity[idField];
        connection.query(`UPDATE ${tableName} SET ? WHERE ${idField}=${id}`, entity,function (error, results, fields) {
          if (error){
            reject(error);
          } else{
            resolve(results.changedRows);
          };
        }); 
        connection.end();
    }),
    
    delete : (tableName, idField, id) => new Promise((resolve, reject) => {
        var connection = createConnection();
        connection.connect();
        connection.query(`DELETE FROM ${tableName} WHERE ${idField} = ${id}`, function (error, results, fields) {
          if (error){
            reject(error);
          } else{
            resolve(results.affectedRows);
          };
        }); 
        connection.end();
    })
   
}