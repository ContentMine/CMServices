
const express    = require('express');
const bodyParser = require('body-parser');
const morgan     = require('morgan');

const app        = express();

var nservices 	 = require('./lib/norma_services.js');
var routerAPI 	 = require('./routes/api.js');

const userWorkspace = nservices.userWorkspace;

// configure the app
// log requests to the console
app.use(morgan('dev')); 

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// TODO factor out all config
// set our port
var port     = process.env.PORT || 3001; 

// Register our routes 
app.use('/api', routerAPI);

app.listen(port);
console.log('Starting CM Services server ' + port);

