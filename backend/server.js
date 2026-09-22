require('dns').setServers(['8.8.8.8','8.8.4.4']);
const http = require('http');
const app = require('./src/app');
const env = require('./src/config/env');
const connectDB = require('./src/config/db');
require('./src/config/redis'); // initializes connection
const initSockets = require('./src/sockets');
const logger = require('./src/utils/logger');

const httpServer = http.createServer(app);

// Attach socket.io and expose io on app so controllers/services can emit events later
const io = initSockets(httpServer);
app.set('io', io);

connectDB().then(() => {
  httpServer.listen(env.port, () => {
    logger.info(`SAHYOG FLOW backend running on port ${env.port} [${env.nodeEnv}]`);
  });
});