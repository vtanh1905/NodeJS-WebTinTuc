var express = require('express');
var carddb = require('../../models/card.model')
var router = express.Router();
router.post('/buy-premium', (req, res, next) =>{
    var id= res.locals.authUser.AccID;
    var Produce = req.body.produce;
    var value = req.body.value;
    var pin = req.body.Pin;
    var seri = req.body.Seri;
    var entity = { AccID :id,ProductBy:Produce,Value:value,
        Seri :seri,Pin:pin,Check:'0',Status:'1'
    }
    carddb.addById(entity).then(n=>{
        res.render('dashboard/', {});
    }).catch(next);

});
// ==================================================================================================================================================================================================================
// Mua Premium
router.get('/buy-premium', (req, res, next) =>{
    res.render('dashboard/buy-premium', {});

  
});
// ==================================================================================================================================================================================================================

module.exports = router;