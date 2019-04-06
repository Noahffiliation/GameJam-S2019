//depends on input.js
//depends on tiles.js

const PLAYERSIZE = 16;
const PLAYERHALFSIZE = PLAYERSIZE / 2;
const PHSZ = PLAYERHALFSIZE;
const SQRT2 = Math.sqrt(2);

const UP = 38
const DOWN = 40
const LEFT = 37
const RIGHT = 39

function Player() {
  this.x = 140;
  this.y = 100;
  this.vx = 0;
  this.vy = 0;
  this.speed = 5;
  this.color = "red";
  this.animationFrame = 0;
  this.inventory = 0;
  this.facing = 0;
  this.message = "hello world";
  this.draw = (ctx) => drawPlayer(ctx, this);
  this.update = function () {
    if (keys[UP]) {
      this.vy = -this.speed;
      this.facing = UP;
    } else if (keys[DOWN]) {
      this.vy = this.speed;
      this.facing = DOWN;
    } else {
      this.vy = 0;
    }
    if (keys[LEFT]) {
      this.vx = -this.speed;
      this.facing = LEFT;
    } else if (keys[RIGHT]) {
      this.vx = this.speed;
      this.facing = RIGHT;
    } else {
      this.vx = 0;
    }

    if (this.vy != 0 && this.vx != 0) {
      this.vy /= SQRT2;
      this.vx /= SQRT2;
    }

    // this.x += this.vx;
    // this.y += this.vy;
    if (this.vy >= 0) { //moving down
      let y_cls = findYCollisionDown(this.y-PHSZ, this.vy, this.x-PHSZ, PLAYERSIZE, PLAYERSIZE);
      if (y_cls == null) {
        this.y += this.vy;
      } else { //landed on something
        this.vy = 0;
        this.y = y_cls.y+PHSZ;
      }
    } else { //moving up
      let y_cls = findYCollisionUp(this.y-PHSZ, this.vy, this.x-PHSZ, PLAYERSIZE, PLAYERSIZE);
      this.midair = true;
      if (y_cls == null) {
        this.y += this.vy;
      } else { //hit your head
        this.vy = 0;
        this.y = y_cls.y+PHSZ;
      }
    }

    if (this.vx > 0) { //moving right
      let x_cls = findXCollisionRight(this.x-PHSZ, this.vx, this.y-PHSZ, PLAYERSIZE, PLAYERSIZE);
      if (x_cls == null) this.x += this.vx;
      else { //hit wall
        this.vx = 0;
        this.x = x_cls.x+PHSZ;
      }
    } else if (this.vx < 0) { //moving left
      let x_cls = findXCollisionLeft(this.x-PHSZ, this.vx, this.y-PHSZ, PLAYERSIZE, PLAYERSIZE);
      if (x_cls == null) this.x += this.vx;
      else { //hit wall
        this.vx = 0;
        this.x = x_cls.x+PHSZ;
      }
    }

  }
}

function drawPlayer(ctx, player) {
  ctx.fillStyle = player.color;
  if (player.inventory) ctx.fillStyle = 'green';
  let left = player.x - PHSZ;
  let top = player.y - PHSZ;
  ctx.fillRect(left, top, PLAYERSIZE, PLAYERSIZE);
  ctx.fillStyle = "black"
  ctx.fillText(player.message, player.x, player.y - PLAYERSIZE)
}

function getLocalTiles(player) {
  tl = getTileFromPos(mapData, player.x - PHSZ, player.y - PHSZ);
  tr = getTileFromPos(mapData, player.x + PHSZ - 1, player.y - PHSZ);
  bl = getTileFromPos(mapData, player.x - PHSZ, player.y + PHSZ - 1);
  br = getTileFromPos(mapData, player.x + PHSZ - 1, player.y + PHSZ - 1);
  return [tl, tr, bl, br];
}

// collision stuff

/* returns Point(x,y)
 * y: suggested relocation
 * x: collision position
 */
function findYCollisionDown(y, vy, x, width, height) {
  vy = Math.ceil(vy);
  if (vy <= 0) return null;
  y = Math.floor(y);
  x = Math.floor(x);
  let bottom = y + height
  for (let r = bottom; r < bottom + vy; r++) {
    if (r >= H) return new Point(x, H - height);
    for (let c = x; c < x + width; c++) {
      if (collisionMap[r][c]) {
        return new Point(c, r - height);
      }
    }
  }
  return null;
}
function findYCollisionUp(y, vy, x, width, height) {
  vy = Math.floor(vy);
  if (vy >= 0) return null;
  y = Math.floor(y);
  x = Math.floor(x);
  for (let r = y - 1; r > y + vy - 1; r--) {
    if (r <= 0) return new Point(x, 0);
    for (let c = x; c < x + width; c++) {
      if (collisionMap[r][c]) {
        return new Point(c, r + 1);
      }
    }
  }
  return null;
}
/* returns Point(x,y)
* y: collision position
* x: suggested relocation
*/
function findXCollisionRight(x, vx, y, width, height) {
  vx = Math.ceil(vx);
  if (vx <= 0) return null;
  x = Math.floor(x);
  y = Math.floor(y);
  let right = x + width;
  for (let c = right; c < right + vx; c++) {
    if (c >= W) return new Point(c - width, y); //right edge
    for (let r = y; r < y + height; r++) {
      if (collisionMap[r][c]) {
        return new Point(c - width, r);
      }
    }
  }
  return null
}
function findXCollisionLeft(x, vx, y, width, height) {
  vx = Math.floor(vx);
  if (vx >= 0) return null;
  x = Math.floor(x);
  y = Math.floor(y);
  for (let c = x - 1; c > x + vx - 1; c--) {
    if (c <= 0) return new Point(0, y); //left edge
    for (let r = y; r < y + height; r++) {
      if (collisionMap[r][c]) {
        return new Point(c + 1, r);
      }
    }
  }
  return null;
}

function Point(x, y) {
  this.x = x;
  this.y = y;
}
