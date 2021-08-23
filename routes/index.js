var express = require('express');
var router = express.Router();
let moment = require('moment');

const db = require('monk')('mongodb://127.0.0.1:27017/Nodeblog')

/* GET home page. */
router.get('/', function(req, res, next) {
  const posts = db.get('posts')
  posts.find({}).then((posts) => {
    console.log
    res.render('index', {posts });
  }).catch(err=>{
    console.log('could not find post...')
  })
  
});

router.get('/:category', function(req, res, next) {
  let category=req.params.category
  console.log(category,'param')
  const posts = db.get('posts')
  posts.find({category:category}).then((posts) => {
    console.log(posts,23)
    console.log
    res.render('index', {posts });
  }).catch(err=>{
    console.log('could not find post...')
  })
  
});

module.exports = router;
