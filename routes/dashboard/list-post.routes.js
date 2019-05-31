var express = require('express');

var router = express.Router();

// ==================================================================================================================================================================================================================
// Bai Viết - START

//Danh Sach Bài Viết
router.get('/list-post', (req, res, next) =>{
    res.render('dashboard/list-post/index', {});
});

//Thêm Bài Viết Mới
router.get('/list-post/add', (req, res, next) =>{
    res.render('dashboard/list-post/add', {});
});

//Sữa Bài Viết Mới
router.get('/list-post/edit', (req, res, next) =>{
    res.render('dashboard/list-post/edit', {});
});

// Bai Viết - END
// ==================================================================================================================================================================================================================


module.exports = router;