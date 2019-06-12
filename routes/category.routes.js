var express = require("express");
var category_model = require('../models/category.model');
var tag_model = require("../models/tag.model");
var post_model = require("../models/post.model");
var moment = require("moment");

var router = express.Router();

router.get("/category/:id", (req, res, next) => {
  const ID = req.params.id;
  const LIMITPAGE =  10;
  const PAGECURRNT = req.query.page || 1;
  const OFFSET = (+PAGECURRNT - 1) * LIMITPAGE;

  if (isNaN(ID)) {
    next();
    return;
  }

  category_model.singleWithParent(ID).then(breadcrumb => {
    Promise.all([post_model.allWithPaging(ID, (breadcrumb[0].CatParentID === null ? 1 : 0),LIMITPAGE, OFFSET), tag_model.getAll(), post_model.countAllWithPaging(ID, (breadcrumb[0].CatParentID === null ? 1 : 0))]).then(([dataPost, ListTag, countPost]) => {
      

      //Xu Li Dư Lieu
      dataPost.forEach(element => {
        //Fomat DateTime
        element.DatePost = moment(element.DatePost, "YYYY-MM-DD HH:mm").format(
          "DD/MM/YYYY HH:mm"
        );

        //Lay Du Lieu Tag
        element.ListTag = [];
        element.ListTagID = element.ListTagID.split(",");
        element.ListTagID.forEach(x => {
          var ObjectTag = {};
          ListTag.forEach(y => {
            if (y.TagID === +x) {
              ObjectTag.ID = y.TagID;
              ObjectTag.Name = y.Name
              return;
            }
          });
          element.ListTag.push(ObjectTag);
        });
      });

      // //Phan Trang
      const TOTALPAGE = Math.ceil(countPost[0].TotalPost / LIMITPAGE);
      const SPACE = 6;
      var Paging = {
        Pages : [],
        PageCurrent : PAGECURRNT,
        nextPage : (+PAGECURRNT + 1) - TOTALPAGE <= 0 ? (+PAGECURRNT + 1) : false,
        prePage : (+PAGECURRNT - 1) > 0 ? (+PAGECURRNT - 1) : false
      }
      var i;
      if(+PAGECURRNT - (SPACE - 2) <= 0){
        i = 1
      }else if((+PAGECURRNT  > (TOTALPAGE  - 3))){
        if(TOTALPAGE < SPACE){
          i = 1
        }else{
          i = TOTALPAGE - SPACE;
        }
      }else {
        i = +PAGECURRNT - 3;
      }

      Paging.Pages.push(i);
      for(var count = 0; count < SPACE; ++count){
        ++i;
        if(i > TOTALPAGE){
          break;
        }
        Paging.Pages.push(i);
      }
      
      console.log('====================================');
      console.log(Paging);
      console.log('====================================');

      res.render("category", {
        breadcrumb : breadcrumb[0],
        dataPost : dataPost,
        Paging : Paging
      });
     }).catch(next);
  }).catch(next);

  

});

module.exports = router;
