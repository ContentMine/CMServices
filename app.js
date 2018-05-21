
var express    = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan     = require('morgan');
const config		 = require('config');
const http = require('http');

var app        = express();
app.use(cors());

var nservices 	 = require('./lib/norma_services.js');
var routerAPI 	 = require('./routes/api.js');
const fileStorageCM = config.fileStorageCM;

// configure the app
// log requests to the console
app.use(morgan('dev')); 

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set our port
var port     = process.env.PORT || config.defaultPort; 

// Register our routes 
app.use('/api', routerAPI);

app.set('port', port);

var server = http.createServer(app);
server.listen(app.get('port'), function(){
   console.log('CMServices listening on port ' + app.get('port'));
	 console.log('All user files in  ' + config.fileStorageCM);
});

app.server = server;

module.exports = { app: app, server: server };

