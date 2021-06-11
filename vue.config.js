const configureAPI = require('./server/api');

module.exports = {
  devServer: {
    before: configureAPI,
    port: 3000,
  },
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap((args) => {
        args[0].title = 'Sound Dropper';
        return args;
      });
  },
};
