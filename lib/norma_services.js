// Interface to norma transform and utility calls
// A shim to wrap norma calls

const config		 = require('config');
const path		 = require('path');

const normaJar = config.normaJar;
const normaCmd = 'java -jar '+normaJar;

var spawn = require('child_process').spawn;

var NormaServices = {}

// The directory which holds all the CProjects
const fileStorageCM = config.fileStorageCM;


// Microservices-style API providing a public interface to 
// norma document-format transforms and file and 
// CM CProject utilities to manage the results of document extraction

// makeProject

NormaServices.makeProject = function (req, res) {
	console.log('Calling makeProject');
	req.requestTime = new Date().toISOString();
	console.log(req.body);

	var fullyQualifiedCorpusName = path.join(fileStorageCM, 
                                        req.body.userWorkspace, 
																				req.body.corpusName);


	const child = spawn('java', ["-jar", normaJar,
															 "--project", fullyQualifiedCorpusName, 
															 "--fileFilter", ".*/(.*)\\.pdf",	
															 "--makeProject", "(\\1)/fulltext.pdf"]);	

	child.stdout.on('data', function(data) {
		console.log('stdout: ' + data);
	});

	child.stderr.on('data', function(data) {
		console.log('stderr: ' + data);
	});

	child.on('close', function(code) {
		console.log('norma completed with code: ' + code);
	});
}


// transformPDF2SVG

NormaServices.transformPDF2SVG = function (req, res) {
	console.log('Calling transformPDF2SVG');
	req.requestTime = new Date().toISOString();
	console.log(req.body);

	var fullyQualifiedCorpusName = path.join(fileStorageCM, 
                                        req.body.userWorkspace, 
																				req.body.corpusName);

	console.log('Calling transformPDF2SVG on ' + fullyQualifiedCorpusName);

	const child = spawn('java', ["-jar", normaJar,
															 "--project", fullyQualifiedCorpusName,
										 					 "--input", "fulltext.pdf",
										 					 "--outputDir", fullyQualifiedCorpusName,  
										 					 "--transform", "pdf2svg" 
															 ]);	

	child.stdout.on('data', function(data) {
				console.log('stdout: ' + data);
	});

	child.stderr.on('data', function(data) {
				console.log('stderr: ' + data);
	});

	child.on('close', function(code) {
				console.log('norma completed with code: ' + code);
	});

}

// transformSVGTABLE2HTML

NormaServices.transformSVGTABLE2HTML = function (req, res) {
	console.log('Calling transformSVGTABLE2HTML');
	req.requestTime = new Date().toISOString();
	console.log(req.body);

	var fullyQualifiedCorpusName = path.join(fileStorageCM, 
                                       		 req.body.userWorkspace, 
																					 req.body.corpusName);

	console.log('Calling transformSVGTABLE2HTML on ' + fullyQualifiedCorpusName);

	const child = spawn('java', ["-jar", normaJar,
															 "--project", fullyQualifiedCorpusName,
										 					 "--fileFilter","^.*tables/table(\\d+)/table(_\\d+)?\\.svg",
										 					 "--outputDir", fullyQualifiedCorpusName,  
										 					 "--transform", "svgtable2html" 
															 ]);	

	child.stdout.on('data', function(data) {
				console.log('stdout: ' + data);
	});

	child.stderr.on('data', function(data) {
				console.log('stderr: ' + data);
	});

	child.on('close', function(code) {
				console.log('norma completed with code: ' + code);
				var tableHTMLPath = path.join(fullyQualifiedCorpusName,
																						req.body.docName,
								 														'tables/table1/table.svg.html');
				console.log('return HTML table at: ' + tableHTMLPath);
				res.sendFile(path.resolve(tableHTMLPath));
	});
}

// cropbox
// Extract the region on the specified page defined by the coordinates and box size

NormaServices.cropbox = function (req, res) {
	console.log('Calling cropbox');
	req.requestTime = new Date().toISOString();
	console.log(req.body);

	var fullyQualifiedCorpusName = path.join(fileStorageCM, 
                                       		 req.body.userWorkspace, 
																					 req.body.corpusName);

	console.log('Calling cropbox on ' + fullyQualifiedCorpusName);

	const child = spawn('java', ["-jar", normaJar,
															 "--project", fullyQualifiedCorpusName,
										 					 "--cropbox", "x0", req.body.x0, 
															              "y0", req.body.y0, 
															              "width", req.body.width,
															              "height", req.body.height,
															              "ydown", "units", "mm", 
										 					 "--pageNumbers", req.body.pageNumber,
										 					 "--output", "tables/table1/table.svg"
															 ]);	

	child.stdout.on('data', function(data) {
				console.log('stdout: ' + data);
	});

	child.stderr.on('data', function(data) {
				console.log('stderr: ' + data);
	});

	child.on('close', function(code) {
				console.log('norma completed with code: ' + code);

	});
}

module.exports = NormaServices

