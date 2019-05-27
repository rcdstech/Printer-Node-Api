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
const server = require('http').createServer(app);
const io = require('socket.io')(server);
global.io = require('socket.io')(server);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors())

monogo.connect();

// TODO:Implementing Swagger for Rest APi Test
// const swaggerDefinition = {
//     info: {
//         title: 'Brother Printer Swagger API',
//         version: '1.0.0',
//         description: 'Endpoints to test the user registration routes',
//     },
//     host: 'localhost:' + port,
//     basePath: '/',
//     securityDefinitions: {
//         bearerAuth: {
//             type: 'apiKey',
//             name: 'Authorization',
//             scheme: 'bearer',
//             in: 'header',
//         },
//     },
// };
// const options = {
//     swaggerDefinition,
//     apis: ['./server/routes/*.js'],
// };
// const swaggerSpec = swaggerJSDoc(options);
// app.get('/swagger.json', function(req, res) {
//     res.setHeader('Content-Type', 'application/json');
//     res.send(swaggerSpec);
// });

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get('/check/available', (req,res) => res.send({done:'active'}));
// All routes for /api are send to API Router
app.use('/api',  api);
app.use('/file',  api_files);
server.listen(port, (err) => {
    if(err) {
        console.log(err)
    }
    console.log('server running on ', port)
})
