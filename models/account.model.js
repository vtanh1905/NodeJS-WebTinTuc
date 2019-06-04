var db = require('../utils/db');

module.exports = {
    udpate: (id,entity)=>{
       
        return db.update('account','AccID',id,entity);
    }
    

}