/* eslint-disable no-console */
import app from './app';
import mongoose from 'mongoose';


import { Server } from 'http';
import config from './app/config';

let server: Server;
console.log('DB',config.database_url)
async function main() {
  try {
    await mongoose.connect(config.database_url as string);
    server = app.listen(config.port, () => {
      console.log(`app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();

process.on('unhandledRejection', () => {
  console.log(`😈 unahandledRejection is detected , shutting down ...`);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on('uncaughtException', () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});



