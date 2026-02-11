Nexaliths – Token-Based Chat Wallet
1. Project Overview

Nexaliths Token-Based Chat Wallet allows users to purchase tokens and use them to send chat messages.

Each message costs a random 10–15 tokens.

Messages cannot be sent if the balance is insufficient or tokens are expired.

Currently, the project has backend, database, and APIs. A minimal frontend can be added later.

GitHub Repository: https://github.com/YUVRAJ-CHAUDHARY/Nexaliths-token-based-chat.git

2. Tech Stack

Backend: Node.js + Express.js

Database: SQLite3

Middleware: body-parser, CORS

Frontend (optional): HTML, CSS, JavaScript

3. Setup & Run
git clone https://github.com/YUVRAJ-CHAUDHARY/Nexaliths-token-based-chat.git
cd Nexaliths-token-based-chat

npm install
node server.js


The server will run at: http://localhost:3000

4. APIs
API	Method	Description	Request Body Example
/purchase	POST	Purchase 100 tokens	{ "user_id": 1 }
/wallet	GET	Get wallet balance & expiry	None
/chat/send	POST	Send a message (10–15 random tokens)	{ "user_id": 1, "text": "Hello" }
/chat/:id/messages	GET	Get all messages for a user	None
Example Responses

Purchase Tokens

{
  "message": "100 tokens purchased successfully",
  "addedTokens": 100,
  "expiresAt": 170xxxxxxx
}


Send Message

{
  "message": "Message sent successfully",
  "costTokens": 12
}


Errors

{ "error": "INSUFFICIENT_TOKENS" }
{ "error": "TOKENS_EXPIRED" }

5. Database Schema

wallet → Stores user balance and token expiry

messages → Stores messages, token cost, and timestamp

transactions → Ledger of all purchases and message debits

Relationships:

1 user → 1 wallet

1 user → many messages

1 user → many transactions

6. Token Expiry Logic

Tokens are valid until the expires_at timestamp.

/chat/send checks:

If balance ≥ message cost → allowed

If expires_at > current time → allowed

Otherwise → message blocked with an error

7. SQLite Database Verification (Optional)

Install DB Browser for SQLite: https://sqlitebrowser.org/

Open app.db from your project folder.

Browse tables:

wallet → check balance & expiry

messages → check messages & cost_tokens

transactions → check ledger

Optional SQL testing:

SELECT * FROM wallet;
SELECT * FROM messages;
SELECT * FROM transactions;

-- For testing insufficient tokens
UPDATE wallet SET balance = 5 WHERE user_id = 1;

-- For testing expired tokens
UPDATE wallet SET expires_at = 0 WHERE user_id = 1;
