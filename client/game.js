function startGame() {
  const ws = new WebSocket(`ws://${location.host}?token=${token}`);

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  let paddleY = 50;

  document.addEventListener("mousemove", e => {
    paddleY = e.clientY / window.innerHeight * 100;
    ws.send(JSON.stringify({ y: paddleY }));
  });

  ws.onmessage = (event) => {
    const state = JSON.parse(event.data);

    ctx.clearRect(0, 0, 500, 500);

    ctx.fillRect(state.ball.x * 5, state.ball.y * 5, 10, 10);
    ctx.fillRect(10, state.paddles[0] * 5, 10, 50);
    ctx.fillRect(480, state.paddles[1] * 5, 10, 50);
  };
}