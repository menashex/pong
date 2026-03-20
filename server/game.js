class Game {
  constructor(p1, p2) {
    this.players = [p1, p2];
    this.state = {
      ball: { x: 50, y: 50, vx: 1, vy: 1 },
      paddles: [50, 50]
    };

    this.loop();
  }

  loop() {
    this.interval = setInterval(() => {
      this.update();
      this.broadcast();
    }, 50);
  }

  update() {
    const b = this.state.ball;
    b.x += b.vx;
    b.y += b.vy;

    if (b.y <= 0 || b.y >= 100) b.vy *= -1;
  }

  setPaddle(playerIndex, y) {
    this.state.paddles[playerIndex] = y;
  }

  broadcast() {
    this.players.forEach(ws => {
      ws.send(JSON.stringify(this.state));
    });
  }
}

module.exports = Game;