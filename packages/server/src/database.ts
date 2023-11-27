import mongoose from 'mongoose';

// import { config } from './environment';

export const connectDatabase = async (): Promise<void> => {
  /* eslint-disable no-console */
  mongoose.connection
    .once('open', () => console.log('Connected with the database!'))
    .on('error', err => console.log(err))
    .on('close', () => console.log('Database connection was closed!'));
  /* eslint-enable no-console */

  await mongoose.connect(
    'mongodb+srv://desai123:desai123@cluster0.bg48i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  );
};
