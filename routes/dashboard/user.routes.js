var express = require('express');

var router = express.Router();

// ==================================================================================================================================================================================================================
// Quản Lý User
router.get('/user', (req, res, next) =>{
    res.render('dashboard/manage/user/index', {});
});
//Add
router.get('/user/add', (req, res, next) =>{
    res.render('dashboard/manage/user/add', {});
});
//Edit
router.get('/user/edit', (req, res, next) =>{
    res.render('dashboard/manage/user/edit', {});
});
// ==================================================================================================================================================================================================================

module.exports = router;