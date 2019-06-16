var hotPost = require('../models/post.model');

module.exports =(req,res,next) =>{
    hotPost.getFiveNewHot().then((rows)=>{
        res.locals.hotPost = rows;
        next();
    }).catch(next);
}