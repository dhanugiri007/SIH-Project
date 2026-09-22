require('dns').setServers(['8.8.8.8','8.8.4.4']);
const http = require('http');
const app = require('./src/app');
const env = require('./src/config/env');
const connectDB = require('./src/config/db');
require('./src/config/redis');
const initSockets = require('./src/sockets');
const socketService = require('./src/services/socketService');
const { startFailureDetectionScheduler } = require('./src/services/failureDetectionScheduler');
const logger = require('./src/utils/logger');

const httpServer = http.createServer(app);

const io = initSockets(httpServer);
app.set('io', io);
socketService.setIO(io);

connectDB().then(() => {
  httpServer.listen(env.port, () => {
    logger.info(`SAHYOG FLOW backend running on port ${env.port} [${env.nodeEnv}]`);
    startFailureDetectionScheduler();
  });
});