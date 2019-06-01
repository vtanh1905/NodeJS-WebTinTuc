var express = require('express');
var carddb = require('../../models/card.model')
var accountdb = require('../../models/account.model');
var router = express.Router();

// Quản Lý Card
router.get('/card', (req, res, next) => {
   // res.end('asdasdas');
    var Dem = 0;
    //danh sach card
    carddb.all().then(rows => {
        if (rows.length > 0) {
            var animals = [];
            rows.forEach((value, number, rows) => {
                carddb.single('account','AccID',value.AccID).then(accounts => {
                    value.name = accounts[0].Username;
                    Dem++;
                    animals.push(accounts[0].Username);
                    if (Dem == rows.length) {
                        res.render('dashboard/manage/card', {Err:false, cards: rows });
                        console.log(rows);
                    }
                   
                }).catch(next);

            });
        }else{
            res.render('dashboard/manage/card', {Err:true, cards: rows });
        }
    }).catch(next);
});
router.post('/card/Xoa/', (req, res, next) => {
    var id = req.body.CardID;
    carddb.delete(id).then(n =>{
        if(n>0){
            res.redirect('/dashboard/card');
        }
    }).catch(next);
});
router.post('/card/GiaHan/', (req, res, next) => {
    var id = req.body.CardID;
   carddb.single('card','CardID',id).then(
    row =>{
       if(row.length>0){         
            carddb.single('account','AccID',row[0].AccID).then(
                acc =>{
                    var date =  acc[0].DatePremium;
                    data = new Date(date);   
                    console.log(acc);                                      
                    date = XuLiDate(date,row[0].Value);
                    var entity = {DatePremium: date};
                    accountdb.udpate(acc[0].AccID,entity).then(value =>{
                        if(value >0){
                            carddb.delete(row[0].CardID).then(n =>{
                                if(n>0){
                                    res.redirect('/dashboard/card');
                                }
                            }).catch(next);
                        }
                    }).catch(next);
                      
                }
            ).catch(next);
       
       }else{
           res.end('lol');
       }
    }
).catch(next);

});
var curday = (sp)=>{
    today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //As January is 0.
    var yyyy = today.getFullYear();
    if(dd<10) dd='0'+dd;
    if(mm<10) mm='0'+mm;
    return (mm+sp+dd+sp+yyyy);
    };
var XuLiDate = (date,Value)=>{
    var currentday = curday('/');
    if(date==null || date <currentday){
        console.log('Nho hon');
        
        date = currentday;
    }
    if(Value ==10000){
        date.setDate(date.getDate()+7);
    
    }else if(Value ==20000){
        date.setDate(date.getDate()+30);
        
    }else if(Value ==50000){
        date.setMonth(date.getMonth()+3);
      
    }else if(Value ==100000){
        date.setMonth(date.getMonth()+9);
        
    }else if(Value ==200000){
        date.setFullYear(date.getFullYear()+2);
        
    }else if(Value ==500000){

        date.setFullYear(date.getFullYear()+5);
       
    }
    return date;
}



module.exports = router;