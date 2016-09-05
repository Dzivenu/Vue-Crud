// server.js

// BASE SETUP
// =============================================================================

var Contact = require('./app/models/contact');
var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:adminulahkitu13@ds013966.mlab.com:13966/problemset_db')
var express        = require('express');        // call express
var app            = express();                 // define our app using express
var bodyParser     = require('body-parser');
var path           = require('path');
var morgan         = require('morgan');
var methodOverride = require('method-override');
var errorHandler   = require('errorhandler');
var port           = process.env.PORT || 8080;        // set our port
var router         = express.Router();              // get an instance of the express Router
var env            = process.env.NODE_ENV;

var app = module.exports = express();

// configure app to use bodyParser()
// this will let us get the data from a POST
app.engine('html',require('ejs').renderFile);
app.set('view engine','html');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(__dirname + '/'));
app.use('/build',express.static('public'));
app.use('/api', router);

if('development' == env) {
    app.use(errorHandler({
        dumpExceptions:true,
        showStack:true
    }));
}

if('production' == app.get('env')) {
    app.use(errorHandler());
}


// middleware to use for all requests
router.use(function(req,res,next){
	//do logging
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});

router.get('/', function(req, res) {
    res.render('index');
});

router.route('/contact')

    // create a contact (accessed at POST http://localhost:8080/api/contact)
    .post(function(req, res) {
        
        var contact = new Contact();      // create a new instance of the Contact model
        contact.name = req.body.name;  // set the contact name (comes from the request)
        contact.title = req.body.title;
        contact.email = req.body.email;
        contact.phone = req.body.phone;
        contact.address = req.body.address;
        contact.company = req.body.company;

        // save the contact and check for errors
        contact.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Contact created!' });
        });
    })

    .get(function(req,res){
        
        var page = req.query.page;
        
        if(page == undefined){
            page = 1;
        }

    	Contact.paginate({},{page:page,limit:4,lean:true},function(err,contact){
    		
            if(err){
    			res.send(err);
            }else{
                var result = [];
                
                var link = 'http://localhost:8080/api/contact?page=';

                var nextPage = Number(contact.page) + 1;
                var prevPage = Number(contact.page) - 1;

                var from = prevPage * contact.limit + 1;
                var to = contact.page * contact.limit;

                if(nextPage > contact.pages){
                    nextPage = null;
                    to = null;
                    from = null;
                }else{
                    nextPage = link + nextPage;
                }

                if(prevPage == 0){
                    prevPage = null;
                }else{
                    prevPage = link + prevPage;
                }

                result.push({
                    total: contact.total,
                    per_page:contact.limit,
                    current_page:contact.page,
                    last_page:contact.pages,
                    next_page_url:nextPage,
                    prev_page_url:prevPage,
                    from:from,
                    to:to,
                    data:contact.docs
                });

                res.json(result[0]);
            }    		
    	});
    });

router.route('/contact/:contact_id')

    // get the contact with that id (accessed at GET http://localhost:8080/api/contact/:contact_id)
    .get(function(req,res){
        Contact.findById(req.params.contact_id, function(err,contact){
            if(err)
                res.send(err);
            res.json(contact);
        });
    })

    .put(function(req, res){
        // user our contact model to find the contact we want
        Contact.findById(req.params.contact_id,function(err, contact){
            if(err)
                res.send(err)

            contact.name = req.body.name;  // update the contact info
            contact.title = req.body.title;
            contact.email = req.body.email;
            contact.phone = req.body.phone;
            contact.address = req.body.address;
            contact.company = req.body.company;

            contact.save(function(err){
                if(err)
                    res.send(err);
                res.json({message: 'Contact Updated !'}); 
            });
        }) ;
    })

    .delete(function(req,res){
        Contact.remove({
            _id: req.params.contact_id
        },function(err,contact){
            if(err)
                res.send(err);

            res.json({message: 'Successfully Deleted'});
        }) ;
    });

app.listen(port);
console.log('Port kebuka di zona ' + port);