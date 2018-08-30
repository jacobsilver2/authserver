// Main starting point of the application
// Not much access to ES6 with node.
const express = require('express');
//this is a low level node library
const http = require('http');
const bodyParser = require('body-parser');
//logging framework
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');


//DB Setup
mongoose.connect('mongodb://localhost/auth');
mongoose.Promise = global.Promise;

// App Setup
app.use(morgan('combined'));
app.use(bodyParser.json( {type: '*/*' }));
router(app);

// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log(`Server listening on: ${port}`);