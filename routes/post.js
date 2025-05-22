var express = require('express');
var router = express.Router();
let {body,validationResult}=require('express-validator')
const db = require('monk')(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Nodeblog');


var multer=require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/upload')
  },
  filename: function (req, file, cb) {
    const newName = `${req.body.title}+${Date.now()}.${file.mimetype.split('/').reverse()[0]}`
    console.log(newName)
    cb(null, newName)
  }
})
var upload=multer({storage:storage,
  limits:{
    fileSize: 1000000000
  }
}).single('mainimage')



/* GET post and categories listings. */
router.get('/show/:id', function(req, res, next) {
  let id=req.params.id
  const post=db.get('posts')
  post.find({_id:id}).then(posts=>{
    console.log(posts)
      res.render('show',{
        posts
  })
  }).catch(err=>{
    throw new Error(err);
  });

});



router.get('/add', function(req, res, next) {
  const category=db.get('categories')
  category.find({}).then(categories=>{
    console.log(categories)
      res.render('addPost',{
    title:'Add Post',
    categories
  })
  }).catch(err=>{
    throw new Error(err);
  })

});





//post route to post writeups
router.post('/addcomment', [
  body('name', 'name field is required').trim().notEmpty(),
  body('email', 'email field is required').isEmail(),
  body('body','body field is required').notEmpty()
] ,function(req, res) {
  
    let errors=validationResult(req).array()
    console.log(errors)
    let {name,postid,email,body}=req.body
    console.log({name,postid,email,body})
 let comment={ name,email, body,commentDate:new Date()}
    if(!(errors.length===0)){
      const posts = db.get('posts')
      posts.find({_id:postid}).then((posts) => {
        res.render('addPost', {posts });
      }).catch(err=>{
        console.log('could not find post...')
      }) 
      return  
    }else{
    const post=db.get('posts')
    post.update({
      _id:postid
    },{ 
      $push: { comment } 
    }).then(data=>{
      console.log(data)
        req.flash('success','your comment have been posted...')
    res.redirect(`/post/show/${postid}`)
    }).catch(err=>{
      console.log(err)
      res.send(err)
    })


    }    



});



router.post('/add', [
  function(req, res, next) { 
    upload(req, res, function (err) {
  if (err) {
    // An unknown error occurred when uploading.
    let imageError={
      "location": "body",
      "msg": "Error occured while uploading file pls check file size",
      "param": "profileimage"
    } 
        req.uploadErr=imageError   
    
  }
  next()
})}
  ,
  body('title', 'title field is required').trim().notEmpty(),
  body('body','body field is required').notEmpty()
] ,function(req, res) {
  
    let errors=validationResult(req).array() 
    let mainimage=req.file ?req.file.filename:'noimage';
    let {title,category,body,author}=req.body
    console.log({title,category,body,author},66)
    if (req.uploadErr && !(errors.length===0)) {
      // An unknown error occurred when uploading. 
      console.log(err)
      errors.push(req.uploadErr)
      console.log(errors,59)
      res.render('addPost',{errors})
      return
    }else if(!(errors.length===0)){
      console.log(err)
      console.log(errors,76)
      res.render('addPost',{errors}) 
      return  
    }else{
    const post=db.get('posts')
    post.insert({
      title,
      category,
      body,
      author,
      mainimage,
      date:new Date()
    }).then(data=>{
      console.log(data)
    
    }).catch(err=>{
      res.send(err)
    })
    req.flash('success','your articule have been posted...')
    res.redirect('/')

    }    



});

module.exports = router;
