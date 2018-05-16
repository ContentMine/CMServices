const express    = require('express');
const multer = require('multer');
const fs 			   = require('fs');
const config 			  = require('config');
const path 			  = require('path');

var nservices 	 = require('../lib/norma_services.js');

const userWorkspace = config.userWorkspace;

const app        = express();

var router = express.Router();

var diskStorage = multer.diskStorage({
  // Directory on server
  destination: function (req, file, cb) {
    // Create a subdirectory using the specified corpusName 
		var fullyQualifiedCorpusName = path.join(userWorkspace, req.body.corpusName);
    !fs.existsSync(userWorkspace) && fs.mkdirSync(userWorkspace);
    !fs.existsSync(fullyQualifiedCorpusName) && fs.mkdirSync(fullyQualifiedCorpusName);
    cb(null, fullyQualifiedCorpusName)
  },
	// File in Directory on server
  filename: function (req, file, cb) {
		// For initial prototype give uploaded file unique name on disk using UTC/ISO time
    // simple temp scheme for testing 
    cb(null, file.originalname + '-' + (new Date().toISOString().replace('T', '_').replace(/:/g,'').replace(/\./g, '').replace(/-/g,'').substr(0, 19)) + '.pdf')
  }
})

var upload = multer({ storage: diskStorage }).any();

// A middleware to use for all requests
router.use(function(req, res, next) {
	console.log('Processing request ...');
	next();
});

// test route to check server running
router.get('/', function(req, res) {
  console.log('Called GET to test basic server availability');
	res.json({ message: 'Welcome to our API!' });	
});

// The corpus API
// A corpus is used to contain one CTree containing one PDF file and 
// the files resulting from transforms and extraction
router.route('/corpus')
	.post(function(req, res) {
  		 upload(req, res, function(err) {
         if (err) {
     			 console.log(err);
     			 return res.end("Error uploading file");
         } else {
	         console.log('Upload PDF to new Corpus:'+req.body.corpusName); 	

			     res.json({ message: 'PDF uploaded' });
		       req.files.forEach( function(f) {
					   // List files in location(s) on server
					   console.log(f);
     		   });
					 nservices.makeProject(req, res);
	   	     res.end('File uploaded and CProject created');
         }
			})
})

router.route('/transformPDF2SVG')
	.post(function(req, res) {
			 // TODO Error handling!
       console.log(req.body);
			 nservices.transformPDF2SVG(req, res);
	     res.end('Called transform PDF2SVG');
		});

router.route('/cropbox')
	.post(function(req, res) {
			 // TODO Error handling!
       console.log(req.body);
			 nservices.cropbox(req, res);
	     res.end('Called cropbox');
		});

router.route('/transformSVGTABLE2HTML')
	.post(function(req, res) {
			 // TODO Error handling!
       console.log(req.body);
			 nservices.transformSVGTABLE2HTML(req, res);
	     res.end('Called SVGTABLE2HTML');
		});

module.exports = router;

