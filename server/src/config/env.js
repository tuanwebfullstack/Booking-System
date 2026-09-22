import dotenv from 'dotenv'
dotenv.config();

const required = ['MONGO_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];

required.forEach((k)=>{
    if(!process.env[k]) {
        throw new Error(`Missing required environment variable: ${k}`)
    }
})
const env = {
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpires: process.env.JWT_ACCESS_EXPIRES,
    refreshExpires: process.env.JWT_REFRESH_EXPIRES,
  },
  clientUrl: process.env.CLIENT_URL,
  rootDomain: process.env.ROOT_DOMAIN,
};

const port = parseInt(env.port,10)

if(isNaN(port) || port<=0 || port > 65535) {
      throw new Error('Invalid environment variable: port must be a valid port number.');
}

export default Object.freeze(env);
