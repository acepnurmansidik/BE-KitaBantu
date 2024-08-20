const dotEnv = require("dotenv");
dotEnv.config();

const ENV = {
  userName: process.env.DB_USER,
  hostName: process.env.DB_HOST,
  password: process.env.DB_PASS,
  databaseName: process.env.DB_NAME,
  timeZone: process.env.DB_TZ,
  maxPool: process.env.MAX_POOL,
  dbPort: process.env.DB_PORT,
  jwtID: process.env.JWT_ID,
  jwtExpired: process.env.TOKEN_EXPIRED,
  jwtRefreshExpired: process.env.REFRESH_TOKEN_EXPIRED,
  secretToken: process.env.TOKEN_SECRET,
  algorithmToken: process.env.TOKEN_ALGORITHM,
  emailHost: process.env.HOST_EMAIL,
  emailPort: process.env.PORT_EMAIL,
  emailSecure: process.env.SECURE_EMAIL,
  emailSender: process.env.SOURCE_EMAIL,
  emailPassword: process.env.PASSWORD_EMAIL,
  saltPassword: process.env.SALT,
  firebaseDb: process.env.FAREBASE_DB_URL,
  fileImgPath: process.env.FILE_PATH,
  redisHost: process.env.REDIS_HOST,
  redisPort: process.env.REDIS_PORT,
  redisPassword: process.env.REDIS_PASSWORD,
  redisLogo: process.env.REDIS_LOGO_UI,
};

module.exports = ENV;
