const configureAPI = require('./server/api')

module.exports = {
  devServer: {
    before: configureAPI
  }
}