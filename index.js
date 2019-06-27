const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 8101;
const api_files = require('./server/routes-files/');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const multer = require('multer');
const fs = require('fs');
const DIR = './uploads/';

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors())

io.sockets.on('connection', function (socket) {
    console.log('client connect');
    socket.on('echo', function (data) {
        io.sockets.emit('message', data);
    });
});
var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		//var code = JSON.parse(req.body.model).empCode;
		cb(null, DIR);
	},
	filename: function (req, file, cb) {
		cb(null, Date.now()+'-'+file.originalname);
	}
});
var upload = multer({ storage: storage });

app.post('/upload', upload.any(), function (req, res) {
		res.send(req.files);
});
app.get('/uploads/:fileName', function (req, res) {
		res.sendFile('uploads/' + req.params.fileName  , { root : __dirname});
});
// Make io accessible to our router
app.use(function(req,res,next){
    req.io = io;
    next();
});

app.get('/check/available', (req,res) => res.send({done:'active'}));
function routes(req, res, next) {
    console.log(req.url)
    next();
  }
  
app.use('/file', routes,  api_files);
http.listen(port, (err) => {
    if(err) {
        console.log(err)
    }
    console.log('server running on ', port)
})
