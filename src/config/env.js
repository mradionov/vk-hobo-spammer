const ENV_DEVELOPMENT = 'development';

const env = process.env.NODE_ENV || ENV_DEVELOPMENT;

exports.isDev = () => {
  return env === ENV_DEVELOPMENT;
};

exports.isProd = () => {
  return !this.isDev();
};
