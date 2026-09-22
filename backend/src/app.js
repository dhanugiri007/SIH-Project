const express = require('express');
const path = require('path');
const cors = require('cors');
const env = require('./config/env');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

const app = express();

app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serves completion-proof photos/videos uploaded via multer
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/health', (req, res) => res.json({ success: true, message: 'OK' }));

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;