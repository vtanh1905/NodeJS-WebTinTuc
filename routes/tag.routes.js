var express = require('express');
var router = express.Router();

router.get('/tag', (req, res, next) =>{
    res.render('tag', {
    });
});


module.exports = router;