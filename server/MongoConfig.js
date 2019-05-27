const mongoose = require('mongoose');
/**
 * Set to Node.js native promises
 * Per http://mongoosejs.com/docs/promises.html
 */
mongoose.Promise = global.Promise;
const { monogoConfig } = require('./config');
const mongoUri = `mongodb://${monogoConfig.host}:${monogoConfig.port}/${monogoConfig.databaseName}`;

function connect() {
    mongoose.set('debug', true);
    return mongoose.connect(mongoUri)
        .then(() => console.log('connection successful'))
        .catch((err) => console.error(err));
}

module.exports = {
    connect,
    mongoose
};
