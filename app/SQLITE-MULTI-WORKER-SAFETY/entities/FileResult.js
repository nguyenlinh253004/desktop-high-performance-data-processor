// entities/FileResult.js
const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'FileResult',
  tableName: 'file_result',
  columns: {
    id: {
      primary: true,
      type: 'integer',
      generated: true
    },
    filePath: {
      type: 'text'
    },
    lines: {
      type: 'integer'
    },
    processedAt: {
      type: 'text'
    }
  }
});
