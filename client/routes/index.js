var express = require('express');
var router = express.Router();
var axios = require('axios');

var API_URL = 'http://localhost:3001/';

var top_level = [
        {
        "description": "The 'Sciences'", 
        "broad_foes": ["01", "05", "06"], 
        "slug": "sciences", 
        "img":"./images/sciences.png"
        },
        {
        "description": "Making things", 
        "broad_foes": ["02", "03","04"], 
        "slug": "making", 
        "img":"./images/making.jpg"
        },
        {
        "description": "The Arts and the Great Unknown", 
        "broad_foes": ["09", "10", "12"], 
        "slug": "art", 
        "img":"./images/art.jpg"
        },
        {
        "description": "People", 
        "broad_foes": ["07", "08", "11"], 
        "slug": "people", 
        "img":"./images/people.jpg"
        }
    ]

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { top_level: top_level });
});

/* GET Broad FOE data for top level category */
router.get('/:slug', function(req, res, next) {
  var param = req.params['slug'];
  var len = param.length;
  var url = `${API_URL}${param}`

  if(len === 2) { // broad foe page
    axios
      .get(url)
      .then(function(result) {
        console.log('AXIOS RESPONSE (NARROW)', result.data)
        res.render('narrow', {narrow:result.data})
      })
  }
  else if (len === 4) { // narrow foe page
    axios
      .get(url)
      .then(function(result) {
        console.log('AXIOS RESPONSE (COURSES)', result.data)
        res.render('courses', {courses:result.data})
      })
  }
  else { // Must be the result of the top level page
    axios
      .get(url)
      .then(function(result) {
        console.log('AXIOS RESPONSE (BROAD)', result.data)
        res.render('broad', {broad:result.data})
      })
  }
  
});

router.get('/course/:course', function(req, res, next) {
  var url = `${API_URL}course/${req.params['course']}`
  console.log('URL', url)
  axios
    .get(url)
    .then(function(result){
      console.log('AXIOS RESPONSE COURSE INFO', result.data)
      res.render('course', {
        course: result.data.course, 
        tafe_url: result.data.tafe_url
      })
    })
})

module.exports = router;
