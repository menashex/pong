const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { register, login, verify } = require('./auth');
const Game = require('./game');

const app = express();
app.use(express.json());

app.post('/register', async (req, res) => {
  await register(req.body.username, req.body.password);
  res.send({ ok: true });
});

app.post('/login', async (req, res) => {
  const token = await login(req.body.username, req.body.password);
  if (!token) return res.status(401).send();
  res.send({ token });
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let waitingPlayer = null;

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, "http://localhost");
  const token = url.searchParams.get("token");
  const user = verify(token);

  if (!user) return ws.close();

  if (!waitingPlayer) {
    waitingPlayer = ws;
    ws.send(JSON.stringify({ msg: "waiting" }));
    return;
  }

  const game = new Game(waitingPlayer, ws);

  [waitingPlayer, ws].forEach((player, index) => {
    player.on('message', msg => {
      const data = JSON.parse(msg);
      game.setPaddle(index, data.y);
    });
  });

  waitingPlayer = null;
});

server.listen(3000, () => console.log("Server running on 3000"));