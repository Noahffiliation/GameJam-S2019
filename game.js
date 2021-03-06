
const UPDATES_PER_SEC = 60;
const MS_PER_UPDATE = 1000 / UPDATES_PER_SEC;
var lastTime = Date.now();
var lag = 0;
var redraw = false;

var player = new Player(0, 0);
var lockpickWindow = null;

function gameInit() {
  play_background_music();
  // setMapData("map3");
  makeEnemies(randInt(1,4))
}

// gameInit();

function gameDraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(floorCanvas, 0, 0);
  ctx.drawImage(collisionCanvas, 0, 0);
  player.draw(ctx);
  Particles.draw(ctx, 0);
  for (let en of enemies) {
    en.draw(ctx);
  }
  ctx.fillStyle = "yellow";
  // ctx.fillText(player.theta, 100,10);
  if (lockpickWindow) lockpickWindow.draw(ctx);

  drawHUD(ctx);
}

function gameUpdate() {
  Particles.update();
  player.update();

  let len = enemies.length;
  for (let i = 0; i < len; i++) {
    enemies[i].update();
  }

  if (alarm > 0) alarm --;
  else alarm = 0;

  if (lockpickWindow) lockpickWindow.update();
  lastKeys = JSON.parse(JSON.stringify(keys)); //deep copy
}

function tick() {
  let current = Date.now();
  let elapsed = current - lastTime;
  lastTime = current;
  lag += elapsed;
  while (lag >= MS_PER_UPDATE) {
    gameState.update();
    if (gameState.state == gameState.MENU) {
      stop_background_music();
      requestAnimationFrame(tick); //awkward, sorry
      return;
    }
    lag -= MS_PER_UPDATE;
    redraw = true;
  }
  if (redraw) {
    gameState.draw();
    redraw = false;
  }
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
