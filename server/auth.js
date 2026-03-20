const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET = "supersecret";

// in-memory DB (replace later)
const users = [];

async function register(username, password) {
  const hash = await bcrypt.hash(password, 10);
  users.push({ username, password: hash });
}

async function login(username, password) {
  const user = users.find(u => u.username === username);
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;

  return jwt.sign({ username }, SECRET);
}

function verify(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

module.exports = { register, login, verify };