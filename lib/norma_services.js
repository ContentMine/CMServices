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
  return new Promise((resolve, reject) => { 
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
						reject(data);
					});

					child.on('close', function(code) {
						console.log('makeProject: norma completed with code: ' + code);
						resolve(code);
					});
	});
}


// transformPDF2SVG

NormaServices.transformPDF2SVG = function (req, res) {
  return new Promise((resolve, reject) => { 
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
						reject(data);
					});

					child.on('close', function(code) {
						console.log('transformPDFSVG: norma completed with code: ' + code);
						resolve(code);
					});
	});
}

// transformSVGTABLE2HTML

NormaServices.transformSVGTABLE2HTML = function (req, res) {
  return new Promise((resolve, reject) => { 
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
						reject(data);
					});

					child.on('close', function(code) {
						console.log('transformSVGTABLE2HTML: norma completed with code: ' + code);
/*
						console.log('norma completed with code: ' + code);
						var tableHTMLPath = path.join(fullyQualifiedCorpusName,
																								req.body.docName,
																								'tables/table1/table.svg.html');
						console.log('return HTML table at: ' + tableHTMLPath);
						res.sendFile(path.resolve(tableHTMLPath));
*/
						if (code == 0) {
						  var tableHTMLPath = path.join(fullyQualifiedCorpusName,
																						req.body.docName,
																						'tables/table1/table.svg.html');
							console.log('Resolve with path: '+tableHTMLPath);
							resolve(path.resolve(tableHTMLPath));
						} else {
							reject('norma SVGTABLE2HTML failed with code '+code);
						}
					});
	});
}


// transformSVGTABLE2CSV

NormaServices.transformSVGTABLE2CSV = function (req, res) {
  return new Promise((resolve, reject) => { 
					console.log('Calling transformSVGTABLE2CSV');
					req.requestTime = new Date().toISOString();
					console.log(req.body);

					var fullyQualifiedCorpusName = path.join(fileStorageCM, 
																									 req.body.userWorkspace, 
																									 req.body.corpusName);

					console.log('Calling transformSVGTABLE2CSV on ' + fullyQualifiedCorpusName);

					const child = spawn('java', ["-jar", normaJar,
																			 "--project", fullyQualifiedCorpusName,
																			 "--fileFilter","^.*tables/table(\\d+)/table(_\\d+)?\\.svg",
																			 "--outputDir", fullyQualifiedCorpusName,  
																			 "--transform", "svgtable2csv" 
																			 ]);	

					child.stdout.on('data', function(data) {
						console.log('stdout: ' + data);
					});

					child.stderr.on('data', function(data) {
						console.log('stderr: ' + data);
					});

					child.on('close', function(code) {
						console.log('norma completed with code: ' + code);
						var tableCSVPath = path.join(fullyQualifiedCorpusName,
																				 req.body.docName,
																				 'tables/table1/table.svg.csv');
						console.log('return table data in CSV at: ' + tableCSVPath);

						if (code === 0) {
							var tableCSVPath = path.join(fullyQualifiedCorpusName,
																	         req.params.docName,
								 										       'tables/table1/table.svg.csv');
							resolve(path.resolve(tableCSVPath));
						} else {
							reject('norma SVGTABLE2CSV failed with code '+code);
						}
					});
	});
}

// cropbox
// Extract the region on the specified page defined by the coordinates and box size

NormaServices.cropbox = function (req, res) {
  return new Promise((resolve, reject) => { 
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
						reject(data);
					});

					child.on('close', function(code) {
						console.log('cropbox: norma completed with code: ' + code);
						resolve(code);
					});
	});
}

module.exports = NormaServices

