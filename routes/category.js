var express = require('express');
var router = express.Router();
let {body,validationResult}=require('express-validator')
const db = require('monk')('mongodb://127.0.0.1:27017/Nodeblog');
const url=require('url')

router.get('/add',(req,res)=>{
  res.render('addCategory',{
    title:'Add Category'
  })
})

/* add new category to the categories db. */
router.post('/add', 
body('name', 'this field is required').trim().notEmpty()
 ,function(req, res, next) {
  let errors=validationResult(req).array()
  if(errors.length===0){
    const category=db.get('categories')
  let name=req.body.name
    category.insert({name}).then(data=>{
            console.log(data)
    }).catch(err=>{
        throw new Error(err)
    })
    
  
    res.render('addCategory',{
      title:'Add Category',
      success:'You have added a new category'
    })
  }else{
      res.render('addCategory',{
        title:'Add Category',
        errors
      })
  }
  
});
   


module.exports = router;
