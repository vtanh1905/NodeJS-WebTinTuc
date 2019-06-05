var categoryModel = require('../models/category.model');

module.exports = (req, res, next) => {
  categoryModel.all().then(rows => {
    var ListCat = [];
    rows.forEach(element => {
      if(!element.CatParent){
        var entity = {
          element,
          children : []
        }
        ListCat.push(entity);
      }
    });

    rows.forEach(x => {
      if(x.CatParent){
        ListCat.forEach(y => {
          if(x.CatParent === y.element.CatID){
            (y.children).push(x);
          }
        });
      }
    });
    res.locals.lcCategories = ListCat;
    next();
  })
}