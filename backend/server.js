const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");


const app = express();

app.use(cors());
app.use(bodyParser.json());

// SQLite DB connection
const db = new sqlite3.Database("app.db", (err) => {
  if (err) {
    console.log("DB error", err);
  } else {
    console.log("Database connected ");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS wallet (
      user_id INTEGER,
      balance INTEGER,
      expires_at INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      text TEXT,
      cost_tokens INTEGER,
      created_at INTEGER
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      type TEXT,
      amount INTEGER,
      created_at INTEGER
    )
  `);

  console.log("All tables ready");
});



// test route
app.get("/", (req, res) => {
  res.send("Server with DB is running 🚀");
});

app.get("/wallet", (req, res) => {
  db.get(
    `SELECT * FROM wallet WHERE user_id = 1`,
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: "DB_ERROR" });
      }
      res.json(row);
    }
  );
});

app.post("/purchase", (req, res) => {
  const TOKENS = 100;

  // 30 days expiry
  const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000;

  db.run(
    `UPDATE wallet 
     SET balance = balance + ?, expires_at = ?
     WHERE user_id = 1`,
    [TOKENS, expiry],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "DB_ERROR" });
      }

      res.json({
        message: "100 tokens purchased successfully",
        addedTokens: TOKENS,
        expiresAt: expiry
      });
    }
  );
});

app.post("/chat/send", (req, res) => {
  const text = req.body?.text;
if (!text) {
  return res.status(400).json({ error: "MESSAGE_TEXT_REQUIRED" });
}
  const costTokens = Math.floor(Math.random() * 6) + 10;

  //  Wallet check
  db.get(
    `SELECT * FROM wallet WHERE user_id = 1`,
    (err, wallet) => {
      if (err) {
        return res.status(500).json({ error: "DB_ERROR" });
      }

      //  Expiry check
      if (wallet.expires_at <= Date.now()) {
        return res.status(400).json({ error: "TOKENS_EXPIRED" });
      }

      //  Balance check
      if (wallet.balance < costTokens) {
        return res.status(400).json({ error: "INSUFFICIENT_TOKENS" });
      }

      //  Atomic operation
      db.serialize(() => {
        // Deduct tokens
        db.run(
          `UPDATE wallet SET balance = balance - ? WHERE user_id = 1`,
          [costTokens]
        );

        // Save message
        db.run(
          `INSERT INTO messages (user_id, text, cost_tokens, created_at)
           VALUES (1, ?, ?, ?)`,
          [text, costTokens, Date.now()]
        );

        // Save transaction (ledger)
        db.run(
          `INSERT INTO transactions (user_id, type, amount, created_at)
           VALUES (1, 'DEBIT', ?, ?)`,
          [costTokens, Date.now()]
        );

        res.json({
          message: "Message sent successfully",
          costTokens: costTokens
        });
      });
    }
  );
});


// Get all messages for a user
app.get("/chat/:id/messages", (req, res) => {
  const userId = parseInt(req.params.id); // :id from URL

  db.all(
    `SELECT * FROM messages WHERE user_id = ? ORDER BY created_at ASC`,
    [userId],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "DB_ERROR" });
      }
      res.json({ messages: rows });
    }
  );
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000");
});
