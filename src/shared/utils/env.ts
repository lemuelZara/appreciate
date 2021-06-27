import dotenv from 'dotenv';

dotenv.config({
  path: './.env'
});

export const {
  JWT_ALGORITHM,
  JWT_PRIVATE_KEY,
  JWT_PUBLIC_KEY,
  TOKEN_EXPIRATION_TIME
} = process.env;
