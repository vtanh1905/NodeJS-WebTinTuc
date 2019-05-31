var express = require('express');

var router = express.Router();

router.get('/category', (req, res, next) =>{
    res.render('category', {
        
    });
});


module.exports = router;