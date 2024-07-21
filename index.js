var Z = 800,
  Y = 0.97,
  X = 10,
  M = (a, b, c) => Math.max(a, Math.min(b, c)),
  N = Math.random,
  A = 40,
  B = 24,
  enemySpawnInterval = 1e3,
  shotInterval = Z,
  lastTime = 0,
  lastEnemySpawn = 0,
  lastShotTime = 0,
  waterLevel = 100,
  maxAir = 200,
  score = 0,
  diverX = A,
  diverY = 400,
  diverVX = 0,
  diverVY = 0,
  diverSpeed = 0.3,
  currentAir = 200,
  isDiverAlive = 1,
  keys = [],
  bullet = [],
  enemy = [],
  F = (a) => (c.fillStyle = a),
  R = c.fillRect.bind(c),
  T = c.fillText.bind(c),
  S = "splice",
  O = (a) => (c.font = a + "px s");

a.width = a.height = Z;
onkeydown = onkeyup = (e) => (keys[e.which] = e.type[5]);

function loop(t) {
  c.clearRect(0, 0, Z, Z);

  // draw background
  F("blue");
  R(0, waterLevel, Z, 700);
  // draw air gauge
  F("#000");
  R(8, 8, maxAir + 4, B);
  // draw score
  O(B);
  T(score, X, 55);
  // draw air gauge
  F("tan");
  R(X, X, currentAir, 20);

  if (isDiverAlive) {
    // arrow key input
    if (keys[38]) diverVY -= diverSpeed;
    if (keys[A]) diverVY += diverSpeed;
    if (keys[37]) diverVX -= diverSpeed;
    if (keys[39]) diverVX += diverSpeed;

    // control air
    if (diverY > waterLevel) {
      isDiverAlive = (currentAir -= (t - lastTime) * 0.01) > 0;
    } else {
      currentAir = M(0, maxAir, currentAir + (t - lastTime) * 0.2);
    }

    // update diver position
    diverVX = M(-diverSpeed * X, diverSpeed * X, diverVX * Y);
    diverVY = M(-diverSpeed * X, diverSpeed * X, diverVY * Y + 0.04);
    diverX = M(0, Z - A / 2, diverX + diverVX);
    diverY = M(waterLevel, Z - A, diverY + diverVY);

    // draw enemy
    if (t - lastEnemySpawn > enemySpawnInterval) {
      lastEnemySpawn = t;
      enemy.push({ x: Z, y: N() * (600 - A) + waterLevel });
    }

    O(60);
    enemy.map((e, eIndex) => {
      if (
        diverX < e.x + A &&
        diverX + A > e.x &&
        diverY < e.y + A &&
        diverY + A > e.y
      ) {
        // collision with diver
        isDiverAlive = 0;
      }
      bullet.map((b, bIndex) => {
        if (b.x < e.x + A && b.x + X > e.x && b.y < e.y + A && b.y + X > e.y) {
          // collision with bullet
          bullet[S](bIndex, 1);
          enemy[S](eIndex, 1);
          score++;
          enemySpawnInterval *= 0.99;
          // apply item effect immediately
          L = N();
          L < 0.1
            ? (maxAir += A)
            : L < 0.2
            ? (diverSpeed *= 1.1)
            : L < 0.3
            ? (shotInterval *= 0.8)
            : 0;
        }
      });

      T("🐟", e.x, e.y + A);
      e.x -= 2;
      // out of screen
      // if (e.x < -A) {
      //   enemy[S](eIndex, 1);
      // }
    });

    // draw bullet
    if (keys[32] && t - lastShotTime > shotInterval) {
      lastShotTime = t;
      bullet.push({ x: diverX + A, y: diverY + A / 2 });
    }
    F("red");
    bullet.map(
      (b) => R((b.x += 7), b.y, X, X)
      // out of screen
      // if (b.x > Z) {
      //   bullet[S](i, 1);
      // }
    );
  }
  // draw diver
  O(A);
  T(isDiverAlive ? "🤿" : "😵", diverX, diverY + A);

  lastTime = t;

  requestAnimationFrame(loop);
}

loop(0);
