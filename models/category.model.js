var db = require('../utils/db');

module.exports={
    all:()=>{
        return db.load('select *  from category where Status = 1');
    },
    allWithParentName:()=>{
        return db.load(`SELECT CAT2.* , CAT1.Name AS ParentName FROM category CAT1 RIGHT JOIN category CAT2 ON CAT1.CatID = CAT2.CatParent and CAT1.Status = 1 where CAT2.Status = 1 `);
    },
    single: (id) => {
        return db.load(`select * from category where CatID = ${id}`);
    },
    singleByName: (Name)=>{
        return db.load(`select * from category where Name = "${Name}"`);
    },
    add: (entity) => {
        var id = entity['CatParent'];
        if(id === 'None'){
            delete entity['CatParent'];
        }
        entity.Status = 1;
        return db.add('category', entity);
    },
    update: (entity, id) => {
        var CatParent = entity['CatParent'];
        if(CatParent === 'None'){
            delete entity['CatParent'];
        }
        entity.Status = 1;
        return db.update('category', 'CatID',id, entity);
    },
    delete: id => {
        return db.load(`update category set Status = 0 where CatID = ${id}`);
    },
    countNumOfCat: ()=>{
        return db.load('select count(*) as total from category where Status = 1');
    },
    singleWithParent : (id) =>{
        return db.load(`SELECT Cat1.CatID, Cat1.Name, Cat2.CatID as 'CatParentID', Cat2.Name as 'CatParentName'
        FROM category AS Cat1 
        LEFT JOIN category AS Cat2 ON Cat1.CatParent = Cat2.CatID  and Cat2.Status = 1
        WHERE Cat1.Status = 1 
        AND Cat1.CatID = ${id}`);
    }
}