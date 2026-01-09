const { DataSource } = require('typeorm');
const FileResult = require('./entities/FileResult');

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'data.db',
  synchronize: true,
  logging: false,
  entities: [FileResult]
});

module.exports = AppDataSource;
