var db = require('./db');
var express = require('express');
var app = express();

var port = process.env.PORT || 3001;

app.use(require('express-json-promise')());

app.get('/', function(req, res) {
  res.send(404);
});

// Individual Course Details
app.get('/course/:course', function(req, res) {
    var course = req.params.course;
    res.json(db.get_course_info(course));
})

app.get('/:slug', function(req, res) {
    var slug = req.params.slug;
    var len = slug.length;
    if (len === 2) {
        res.json(db.get_narrow_foes(slug))
    }
    else if (len === 4) {
        res.json(db.get_courses(slug))
    }
    else {
        res.json(db.get_broad_foes_from_slug(slug))
    }
    
    //res.json(slug)
})




// I don't think this route is used...
app.get('/:top_level/:broad', function(req, res) {
    var broad = req.params.broad;
    res.json(db.get_narrow_foes(broad));
})

app.listen(port,  process.env.PORT ||function() {
  console.log(`Example app listening on port $ process.env.PORT ||{port}! process.env.PORT ||`)
})

