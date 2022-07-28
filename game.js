const playerSpeed = 120;
const baseJumpForce = 200;
let addedJumpForce = 0;
canJump = true;
let isJumping = false;
kaboom({
  global: true,
  fullscreen: true,
  scale: 2,
  clearColor: [0, 0, 1, 0.7],
});
loadRoot("./sprites/");
loadSprite("mario", "mario.png");
loadSprite("marioLeft", "marioLeft.png");
loadSprite("coin", "coin.png");
loadSprite("block", "block.png");
loadSprite("evil_mushroom", "evil_mushroom.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("surprise", "surprise.png");
loadSprite("pipe", "pipe_up.png");
loadSprite("unboxed", "unboxed.png");
loadSound("gameSound", "gameSound.mp3");
loadSound("jumpSound", "jumpSound.mp3");

scene("lose", () => {
  add([
    text("GAME OVER\n press r to restart", 32),
    pos(width() / 2, height() / 2),
    origin("center"),
  ]);
  keyPress("r", () => {
    go("game");
  });
});

scene("game", () => {
  layers(["bg", "obj", "ui"], "obj");
  const map = [
    "                                            ",
    "                                            ",
    "                                            ",
    "                                            ",
    "                                            ",
    "                                            ",
    "                                            ",
    "                                            ",
    "                                            ",
    "                                            ",
    "                                            ",
    "                 ?=====$                    ",
    "                                            ",
    "              G                             ",
    "============================================",
  ];
  play("gameSound");
  const mapSymbols = {
    width: 20,
    height: 20,

    "=": [sprite("block"), solid()],
    $: [sprite("surprise"), solid(), "surprise-coin"],
    "?": [sprite("surprise"), solid(), "surprise-mushroom"],
    C: [sprite("coin"), "coin"],
    U: [sprite("unboxed"), solid(), "unboxed"],
    M: [sprite("mushroom"), "mushroom"],
    G: [sprite("evil_mushroom"), solid(), "evil_mushroom"],
  };

  const player = add([
    sprite("mario"),
    pos(100, 100),
    solid(),
    body(),
    origin("bot"),
  ]);
  let score = 0;
  const scoreLabel = add([
    text("Score: " + score),
    pos(player.pos),
    layer("ui"),
    {
      value: score,
    },
  ]);
  const gameLevel = addLevel(map, mapSymbols);

  keyDown("right", () => {
    player.move(playerSpeed, 0);
  });
  keyDown("left", () => {
    player.move(-playerSpeed, 0);
  });
  keyDown("up", () => {
    if (player.grounded()) {
      canJump = true;
      startPos = player.pos.y;
      play("jumpSound");
      player.jump(baseJumpForce);
    }

    if (startPos - player.pos.y < 40 && canJump == true) {
      player.jump(baseJumpForce);
    } else {
      startPos = 1000;
    }
  });

  player.on("headbump", (obj) => {
    canJump = false;
    if (obj.is("surprise-coin")) {
      gameLevel.spawn("C", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("U", obj.gridPos);
    }
    if (obj.is("surprise-mushroom")) {
      gameLevel.spawn("M", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("U", obj.gridPos);
    }
  });
  player.collides("coin", (obj) => {
    destroy(obj);
    scoreLabel.value += 100;
    scoreLabel.text = scoreLabel.value;
  });
  player.collides("mushroom", (obj) => {
    destroy(obj);
    scoreLabel.value += 100;
    scoreLabel.text = scoreLabel.value;
  });
  player.collides("evil_mushroom", (obj) => {
    if (isJumping) {
      destroy(obj);
      scoreLabel.value += 100;
      scoreLabel.text = scoreLabel.value;
    } else {
      go("lose");
    }
  });
  player.action(() => {
    camPos(player.pos.x, 200);
    
    if (player.grounded()) {
      isJumping = false;
    } else {
      isJumping = true;
    }
  });
  action("evil_mushroom", (x) => {
    x.move(50, 0);
  });
});
start("game");
