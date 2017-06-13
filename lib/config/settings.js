var config = {
  log4js: {
    file: './lib/config/log4js.json',
    appender: 'dateFile',
    route: {
      client: 'client',
      server: 'server',
      test: 'test'
    }
  },
  socket: {
    remote: {
      host: '10.0.0.144',
      port: 8085,
      domain: 'ws://services.local'
    },
    local: {
      host: '127.0.0.1',
      port: 8080,
      domain: 'ws://services.local'
    }
  },
  mongo: {
    remote: {
      host: '10.0.0.160',
      port: 45555
    },
    local: {
      host: 'localhost'
    }
  }
};
module.exports = config;