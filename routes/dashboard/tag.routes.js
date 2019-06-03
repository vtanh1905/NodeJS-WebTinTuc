var express = require('express');
var tagdb = require('../../models/tag.model');
var router = express.Router();

// ==================================================================================================================================================================================================================

router.get('/tag/is-available', (req, res, next) =>{
    var name = req.query.name;
    var id = req.query.username || "";
    console.log(name);
        console.log(id);
        
    tagdb.SingleByName(name).then(row =>{
        console.log(row);
        if(row.length > 0){
            if(row[0].TagID == id){
                return res.json(true);
            }
            return res.json(false);
           
        }
        return res.json(true);
    }).catch(next);
   
});
router.post('/tag/add', (req, res, next) =>{
    var name = req.body.name;
    var des = req.body.des || "";
   var entity = {Name: name,Desciption:des,Status:'1'};

    tagdb.add(entity).then(n=>{
        res.redirect('/dashboard/tag');  
    }).catch(next);
});
router.post('/tag/delete', (req, res, next) =>{
    var id = req.body.id_delete;
    console.log(id);
    
    var entity = {Status: '0'};
    tagdb.delete(id,entity).then(n=>{
       if(n>0){
        res.redirect('/dashboard/tag');  
       }else{
           next();
       }
    }).catch(next);
});
// Quản Lý Tag
router.post('/tag/edit', (req, res, next) =>{
    var id = req.body.ID;
    var name = req.body.name;
    var des = req.body.des || "";
    var entity = {Name :name ,Desciption: des };
    tagdb.update(id,entity).then(n=>{
       
        res.redirect('/dashboard/tag');
        
    }).catch(next);
});
router.get('/tag', (req, res, next) =>{
    var page = req.query.page || 1;
    var limit =  5;
    var offset = (page -1)*limit;
    var search = req.query.search || "";
    if(search != ""){
        search = search.replace('+','');
    }
    console.log(search);
    
   Promise.all([
       tagdb.all(search,limit,offset),
       tagdb.countAll(search),
   ]
    ).then(([rows,count_rows])=>{
        console.log(rows);
        
       var  total = count_rows[0].total;
        var nPages = Math.floor(total/limit);
        var pages =[];
        if(total% limit >0) nPages++;
        var Check =page-3;
        if(Check<1){
            Check=1;
        }
        var Dem=0;
        for(var i=Check;i<=nPages;i++){
            var obj = {value: i,active: i === +page};
            pages.push(obj);
           
            if(i>page){
                Dem++;
            }
            if(Dem==3){
                break;
            }
        }
        var pageNext;
        var pagePre;
        if(page<nPages){
            pageNext=  parseInt(page)+1;
        }else{
            pageNext=page;
        }
        if(page>1){
            pagePre=  parseInt(page)-1;
        }else{
            pagePre=page;
        }

        if (rows.length > 0) {
            
            res.render('dashboard/manage/tag', {Err:false, tags: rows,pages,pageNext,pagePre,search
            });
        }else{
            res.render('dashboard/manage/tag', {Err:true});
        }
        
    }

        ).catch(next);
    
});
// ==================================================================================================================================================================================================================


module.exports = router;