import merge from 'lodash.merge';
import localConfig from './local';
import prodConfig from './prod';
import testingConfig from './testing';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const stage = process.env.STAGE || 'local';

// Fail fast if required env vars are missing
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required');
}

let envConfig = {};

if (stage === 'production') {
  envConfig = prodConfig;
} else if (stage === 'testing') {
  envConfig = testingConfig;
} else {
  envConfig = localConfig;
}

export default merge(
  {
    stage,
    env: process.env.NODE_ENV,
    port: 3001,
    secrets: {
      jwt: process.env.JWT_SECRET,
      dbUrl: process.env.DATABASE_URL,
      jwtExp: '1h',
    },
  },
  envConfig
);
