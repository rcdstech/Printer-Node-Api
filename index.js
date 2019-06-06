const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 8101;
const api_files = require('./server/routes-files/');
const http = require('http').Server(app);
const io = require('socket.io')(http);

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
