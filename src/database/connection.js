const mongoose = require('mongoose');
const config = require('../config');
const logger = require('../utils/logger');

async function connectDatabase() {
  mongoose.set('strictQuery', true);
  await mongoose.connect(config.mongodbUri, {
    serverSelectionTimeoutMS: 15000,
    maxPoolSize: 20,
  });
  logger.info('MongoDB connected');
  mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
  mongoose.connection.on('error', (e) => logger.error('MongoDB error:', e.message));
}

module.exports = { connectDatabase };