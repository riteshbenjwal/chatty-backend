import Logger from 'bunyan';
import mongoose from 'mongoose';
import { config } from './config';

const log: Logger = Logger.createLogger({ name: 'setupDatabase' });

export default () => {
  const connect = () => {
    mongoose
      .connect(`${config.DATABASE_URL}`)
      .then(() => {
        log.info('Successfully connected to MongoDB');
      })
      .catch((error) => {
        log.error('Error connecting to MongoDB: ', error);
        return process.exit(1);
      });
  };
  connect();
  mongoose.connection.on('disconnected', connect);
};
