var express = require('express');
var categoryModel = require('../../models/category.model');

var router = express.Router();

router.get('/category', (req, res, next) =>{
        categoryModel.allWithParentName().then((rows)=>{
        for(var c  of rows){
            if(c.ParentName === null){
                c.ParentName = 'None';
            }
        }
        res.render('dashboard/manage/category',{
            category:rows,
        });
    }).catch(next);
});

router.get('/category/is-available',(req,res,next) => {
    var user = req.query.Name;
    categoryModel.singleByName(user).then((rows)=>{
        
        if(rows.length  > 0){
            return res.json(false);
        }
        return res.json(true);
    }).catch(next);
});

router.get('/category/delete', (req, res, next)=>{
    var CatID = req.query.id;
    if(isNaN(CatID)) next();
    categoryModel.delete(CatID).then(n =>{
        res.redirect('/dashboard/category');

    }).catch(next);
});

router.post('/category',(req,res,next)=>{  
    categoryModel.add(req.body)
    .then(id => {
      res.redirect('/dashboard/category');
    }).catch(next);
});
router.post('/category/update',(req,res,next)=>{  
    var CatID = req.query.id;
    if(isNaN(CatID)) next();
    else{
        categoryModel.update(req.body, CatID).then(n =>{
            res.redirect('/dashboard/category');
        }).catch(next);
    }
});
module.exports = router;