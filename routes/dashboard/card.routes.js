var express = require('express');

var router = express.Router();

// Quản Lý Card
router.get('/card', (req, res, next) =>{
    res.render('dashboard/manage/card', {});
});


module.exports = router;