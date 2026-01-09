const AppDataSource = require('./db');

class DBWriter {
  constructor() {
    this.queue = [];
    this.writing = false;
  }

  async init() {
    await AppDataSource.initialize();
    await AppDataSource.query('PRAGMA journal_mode = WAL;');
  }

  push(data) {
    this.queue.push(data);
    this.flush();
  }

  async flush() {
    if (this.writing) return;
    this.writing = true;

    while (this.queue.length) {
      const batch = this.queue.splice(0, 20);

      await AppDataSource.manager.transaction(async manager => {
        for (const item of batch) {
          await manager.insert('FileResult', item);
        }
      });
    }

    this.writing = false;
  }
}

module.exports = new DBWriter();
