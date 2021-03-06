require('dotenv').config();
var r = require('rethinkdbdash')();

module.exports = {

    top_level: [
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
    ],

    get_broad_foes_from_slug: function(slug) {
        // Takes a slug from top_level global and returns
        // a function call to get_broad_foes on the broad_foes used
        var broad_foes = 
            []
            .concat
            .apply(
                [],
                this.top_level
                    .filter(function(item) {
                        return item.slug == slug
                    })
                    .map(function(item) {
                        return item['broad_foes']
                    }));

                //console.log('BROAD FOES:', broad_foes)

        return this.get_broad_foes(broad_foes);
    },

    get_broad_foes: function (list) {
        // returns a REQL query
        return (
            r
            .table('narrow_foes')
            .pluck(
                {
                    'broad_code':true, 
                    'broad_description':true
                })
            .distinct()
            .filter(
                function (doc) {
                    return r
                            .expr(list)
                            .contains(doc("broad_code"));
            }
            ).run()
            .then(function(result) {
                console.log(result)
                var result = result.map(function(instance) {
                    return {
                        'code':instance['broad_code'],
                        'description':instance['broad_description']
                    }
                })
                console.log('MAPPED RESULT:', result)
                return result 
            })
        )
    },

    get_narrow_foes: function(broad_code) {
        // Returns a REQL list of narrow FOES
        return(
            r
            .table('tafe_courses')
            .filter(
                r
                .row('ASCED')('code')
                .slice(0, 2)
                .eq(broad_code)
            )
            .pluck({'ASCED':true})
            .distinct()
            .orderBy(r.row('ASCED')('code'))
            .run()
            .then(function(result) {
                console.log(result)
                var result = result.map(function(instance) {
                    return {
                        'code':instance['ASCED']['code'],
                        'description':instance['ASCED']['description']
                    }
                })
                console.log('MAPPED RESULT:', result)
                return result
            })
        )
    },

    get_courses: function(narrow_code) {
        return (
            r
            .table('tafe_courses')
            .filter(
                {
                    'ASCED': 
                        {
                            'code':narrow_code
                        }
                }
            )
            .orderBy(
                'Course Name', 'Campus', 'Study Mode'
            )
            .run()
            .then(function(result) {
                console.log(result)
                return result
            })
        )
    },

    get_course_info: function(course) {
        return (
            r
            .table('tafe_courses')
            .filter({
                'TAFE_SA_code': course
            })
            .limit(1)
            .run()
            .then(function(result) {
                console.log(result)
                var result = result.map(function(instance){
                    return {course: instance, tafe_url: instance['URL'] + '.aspx'}
                })
                console.log('MAPPED COURSE INFO:', result[0])
                return result[0]
            })
        )
    }

}
