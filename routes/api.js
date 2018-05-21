const express    = require('express');
const multer = require('multer');
const fs 			   = require('fs-extra');
const config 			  = require('config');
const path 			  = require('path');

var nservices 	 = require('../lib/norma_services.js');

const fileStorageCM = config.fileStorageCM;

const app        = express();

var router = express.Router();

// Each PDF document has the following 'coordinates'
//    fileStorageCM -- where the CMServices platform stores all user files
//    userWorkspace -- where all this user's files are stored
//    corpusName -- contains one (or more) documents (CM CProject)
//    docName -- one document (CM CTree), e.g., a DOI or other unique name

// All these parameters should be strings suitable for use as directory and file names

var diskStorage = multer.diskStorage({
  // Directory on server
  destination: function (req, file, cb) {
		console.log("Uploading... Doc coords:");
		console.log("fileStorageCM:"+fileStorageCM);
    // Create a subdirectory using the specified doc coordinates 
		var fullyQualifiedDocName = path.join(fileStorageCM, 
		                                         req.body.userWorkspace, 
																						 req.body.corpusName,
																						 req.body.docName);
		console.log(fullyQualifiedDocName);

		// Ensure the full path exists, creating directories if necessary
    fs.ensureDirSync(fullyQualifiedDocName); 

    cb(null, fullyQualifiedDocName)
  },
	// File in Directory on server
  filename: function (req, file, cb) {
    cb(null, req.body.docName + '.pdf');
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
					var fullyQualifiedDocName = path.join(fileStorageCM, 
		                                         req.body.userWorkspace, 
																						 req.body.corpusName,
																						 req.body.docName);

	         console.log('Upload PDF to new Corpus:'+fullyQualifiedDocName); 	

			     res.json({ message: 'PDF uploaded' });
		       req.files.forEach( function(f) {
					   // List files in location(s) on server
					   console.log(f);
     		   });
					 nservices.makeProject(req, res);
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
		});

router.route('/transformSVGTABLE2CSV')
	.post(function(req, res) {
			 // TODO Error handling!
       console.log(req.body);
			 nservices.transformSVGTABLE2CSV(req, res);
		});


// GET routes 
// Retrieve results from filesystem

router.route('/getTableHTML/:userWorkspace/:corpusName/:docName/')
	.get(function(req, res) {
			 // TODO Error handling!
       console.log(req.params);

			 // Return the result already stored for this doc (if any)
			 var fullyQualifiedCorpusName = path.join(fileStorageCM, 
                                       		 req.params.userWorkspace, 
																					 req.params.corpusName);
			 var tableHTMLPath = path.join(fullyQualifiedCorpusName,
																		 req.params.docName,
								 										 'tables/table1/table.svg.html');

			 if (!fs.existsSync(tableHTMLPath)) { 
     		 console.log("File not found:"+tableHTMLPath);
     		 return res.end("File not found:"+tableHTMLPath);
			 } else {
			 	 console.log('return table data in HTML at: ' + tableHTMLPath);
			 	 res.sendFile(path.resolve(tableHTMLPath));
			 }
		});

router.route('/getTableCSV/:userWorkspace/:corpusName/:docName/')
	.get(function(req, res) {
			 // TODO Error handling!
       console.log(req.params);

			 // Return the result already stored for this doc (if any)
			 var fullyQualifiedCorpusName = path.join(fileStorageCM, 
                                       		 req.params.userWorkspace, 
																					 req.params.corpusName);
			 var tableCSVPath = path.join(fullyQualifiedCorpusName,
																		 req.params.docName,
								 										 'tables/table1/table.svg.csv');

			 if (!fs.existsSync(tableCSVPath)) { 
     		 console.log("File not found:"+tableCSVPath);
     		 return res.end("File not found:"+tableCSVPath);
			 } else {
			 	 console.log('return table data in CSV at: ' + tableCSVPath);
			 	 res.sendFile(path.resolve(tableCSVPath));
			 }
		});



module.exports = router;

