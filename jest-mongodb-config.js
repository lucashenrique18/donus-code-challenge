module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '4.2.8',
      skipMD5: true
    },
    instance: {
      dbName: 'jest'
    },
    autoStart: false
  }
}
