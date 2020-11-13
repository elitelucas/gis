module.exports = {
  port: process.env.PORT || 8080,
  db: {
    dev: process.env.DB_DEV || 'mongodb://localhost:27017/debcoin',
    prod: process.env.DB_PROD || 'mongodb://localhost:27017/debcoin1',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    }
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'development_secret',
    expiry: '1h'
  }
};
