const ENV_DEVELOPMENT = 'development';

const env = process.env.NODE_ENV || ENV_DEVELOPMENT;

exports.isDev = () => env === ENV_DEVELOPMENT;
exports.isProd = () => !this.isDev();
