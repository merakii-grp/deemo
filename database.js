const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./test.db');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)");

  const stmt = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
  stmt.run('Charlie', 'charlie@example.com');
  stmt.finalize();

  db.each("SELECT id, name, email FROM users", (err, row) => {
    console.log(`${row.id}: ${row.name} - ${row.email}`);
  });
});

db.close();
