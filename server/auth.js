const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('./db');

const SECRET = "supersecret";

async function register(username, password) {
  const hash = await bcrypt.hash(password, 10);

  await db.query(
    'INSERT INTO users (username, password) VALUES ($1, $2)',
    [username, hash]
  );
}

async function login(username, password) {
  const res = await db.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );

  if (res.rows.length === 0) return null;

  const user = res.rows[0];

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;

  return jwt.sign({ id: user.id, username: user.username }, SECRET);
}

function verify(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

module.exports = { register, login, verify };