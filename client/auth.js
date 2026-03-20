let token = null;

async function register() {
  await fetch('/register', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      username: user.value,
      password: pass.value
    })
  });
  alert("registered");
}

async function login() {
  const res = await fetch('/login', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({
      username: user.value,
      password: pass.value
    })
  });

  const data = await res.json();
  token = data.token;

  startGame();
}