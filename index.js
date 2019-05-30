const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 8101;
const parser = require('./server/util/parser');
const api = require('./server/routes/');
const api_files = require('./server/routes-files/');
const monogo = require('./server/MongoConfig');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const http = require('http').Server(app);
const io = require('socket.io')(http);
// global.io = require('socket.io')(http);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors())

monogo.connect();

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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/check/available', (req,res) => res.send({done:'active'}));
// All routes for /api are send to API Router
app.use('/api',  api);
app.use('/file',  api_files);
http.listen(port, (err) => {
    if(err) {
        console.log(err)
    }
    console.log('server running on ', port)
})
