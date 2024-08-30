import dotenv from "dotenv";
import EnvConfig from "./types/interface";

dotenv.config();

const {
  PORT,
  TOKEN_SECRET_KEY,
  CLIENT_ORIGIN_URL,
  EMAIL,
  PASSWORD,
} = process.env;

// check whether all env variables are loaded
if (
  !PORT ||
  !TOKEN_SECRET_KEY ||
  !CLIENT_ORIGIN_URL ||
  !EMAIL ||
  !PASSWORD
) {
  throw new Error(`Some evironment variables are missing`);
}

const config: EnvConfig = {
  port: PORT,
  secret_key: TOKEN_SECRET_KEY,
  client_origin: CLIENT_ORIGIN_URL,
  senderEmail: EMAIL,
  password: PASSWORD,
};

export default config;
