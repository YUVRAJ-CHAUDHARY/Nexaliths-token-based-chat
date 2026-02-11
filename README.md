Nexaliths-(Token-Based Chat Wallet)

1. Project Introduction

This project is a Token-Based Chat Wallet by Nexaliths Innovation.

Users can purchase tokens and use them to send chat messages.

Each message costs a random 10–15 tokens.

If balance is insufficient or tokens are expired, messages cannot be sent.

Currently, the project includes backend, database, and APIs. A minimal frontend can be added later.

2. Tech Stack

Backend: Node.js + Express.js

Database: SQLite3

Middleware: body-parser, CORS

Frontend (optional): HTML, CSS, JavaScript

3. Setup and Run Instructions

Clone the project:

git clone <repo-url>
cd <NEXALITHS>>


Install dependencies:

npm install


Start the server:

node server.js


The server will run at:

http://localhost:3000

4. APIs
API	Method	Description	Request Body Example
/purchase	POST	Purchase 100 tokens	{ "user_id": 1 }
/wallet	GET	Get wallet balance and expiry	None
/chat/send	POST	Send a message (random 10–15 tokens)	{ "user_id": 1, "text": "Hello" }
/chat/:id/messages	GET	Get all messages for a user	None
4.1 Example Requests & Responses

Purchase Tokens

POST /purchase


Response:

{
  "message": "100 tokens purchased successfully",
  "addedTokens": 100,
  "expiresAt": 170xxxxxxx
}


Send Message

POST /chat/send
Body: { "user_id": 1, "text": "Hello World" }


Response:

{
  "message": "Message sent successfully",
  "costTokens": 12
}


Error – Insufficient Tokens

{ "error": "INSUFFICIENT_TOKENS" }


Error – Expired Tokens

{ "error": "TOKENS_EXPIRED" }

5. Database Schema

wallet → Stores user balance and token expiry

messages → Stores messages, token cost, and timestamp

transactions → Ledger for all purchases and message debits

Relationships:

1 user → 1 wallet

1 user → many messages

1 user → many transactions

6. Expiry Logic

Tokens are valid until the expires_at timestamp.

/chat/send checks:

If balance >= message cost → allowed

If expires_at > now → allowed

Otherwise → message blocked with error

7. Frontend / Screenshots

Minimal frontend can be added later.

Screenshots can show:

Wallet balance + expiry

Message list

Errors for insufficient or expired tokens

8. SQLite Browser Guide (Optional Verification)

You can use DB Browser for SQLite to inspect your database and verify your project tables.

Step 1: Install DB Browser

Visit https://sqlitebrowser.org/

Download and install according to your OS (Windows)

Step 2: Open Your Database

Launch DB Browser for SQLite

Click Open Database → select app.db from your project folder

Step 3: Browse Tables

Go to Browse Data tab

Select table from dropdown:

wallet → check balance & expiry

messages → check messages and cost_tokens

transactions → check ledger

Step 4: Run SQL Queries (Optional)

Go to Execute SQL tab

Example queries:

SELECT * FROM wallet;
SELECT * FROM messages;
SELECT * FROM transactions;


Click Execute All → see results in table format

Step 5: Edit Data for Testing

Test insufficient tokens:

UPDATE wallet SET balance = 5 WHERE user_id = 1;


Test expired tokens:

UPDATE wallet SET expires_at = 0 WHERE user_id = 1;


Click Write Changes → saves data
