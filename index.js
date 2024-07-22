const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

console.log('Starting the server...');

const db = new sqlite3.Database('./test.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.serialize(() => {
      db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT)", (err) => {
        if (err) {
          console.error('Error creating table:', err.message);
        } else {
          console.log('Table created or already exists.');
        }
      });
    });
  }
});

app.use(bodyParser.json());

app.get('/users', (req, res) => {
  db.all("SELECT id, name, email FROM users", [], (err, rows) => {
    if (err) {
      console.error('Error fetching users:', err.message);
      res.status(500).send('Internal server error');
    } else {
      res.json(rows);
    }
  });
});

app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  db.get("SELECT id, name, email FROM users WHERE id = ?", [id], (err, row) => {
    if (err) {
      console.error('Error fetching user:', err.message);
      res.status(500).send('Internal server error');
    } else {
      res.json(row);
    }
  });
});

app.post('/users', (req, res) => {
  const { name, email } = req.body;
  db.run("INSERT INTO users (name, email) VALUES (?, ?)", [name, email], function(err) {
    if (err) {
      console.error('Error adding user:', err.message);
      res.status(400).json({ "error": err.message });
    } else {
      res.json({
        "message": "User added successfully",
        "data": { id: this.lastID, name, email }
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
