var express = require('express');

var router = express.Router();

router.get('/post', (req, res, next) =>{
    res.render('post', {
        
    });
});

module.exports = router;