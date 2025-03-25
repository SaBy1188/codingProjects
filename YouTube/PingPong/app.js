let ctx = gameboard.getContext('2d');
let isSinglePlayer = false;
let player1 = 80;
let player2 = 200;
let keyState = {};
let ball = { x: 360, y: 240, speedX: 3, speedY: 0 };
let scorePlayer1 = 0;
let scorePlayer2 = 0;

// key
document.addEventListener('keydown', (e) => (keyState[e.key] = true));
document.addEventListener('keyup', (e) => (keyState[e.key] = false));

function setMode(singlePlayer) {
    isSinglePlayer = singlePlayer; // set mode
    document.getElementById('modeDisplay').innerText = 'Mode: ' + (isSinglePlayer ? 'Single Player' : 'Multiplayer');

    // reset button
    document.querySelectorAll('button').forEach((btn) => btn.classList.remove('active'));

    // highlight mode
    if (singlePlayer) {
        document.querySelector('button:nth-of-type(1)').classList.add('active');
    } else {
        document.querySelector('button:nth-of-type(2)').classList.add('active');
    }

    // start ai
    if (isSinglePlayer) {
        requestAnimationFrame(moveAI);
    }
}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 720, 480); // hide

    ctx.fillStyle = 'white';
    ctx.fillRect(10, player1, 10, 80); // left player
    ctx.fillRect(700, player2, 10, 80); // right player
    ctx.fillRect(ball.x, ball.y, 10, 10); // ball

    drawScore();
    requestAnimationFrame(draw);
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.fillText(scorePlayer1, 300, 50);
    ctx.fillText(scorePlayer2, 420, 50);
}

function moveAI() {
    if (!isSinglePlayer) return; // case: multiplayer, turn AI off

    let aiSpeed = 4;
    if (ball.y < player2 + 35) {
        player2 -= aiSpeed;
    }

    if (ball.y > player2 + 45) {
        player2 += aiSpeed;
    }

    player2 = Math.max(0, Math.min(400, player2));

    requestAnimationFrame(moveAI);
}

function movePlayers() {
    if (isSinglePlayer) {
        // ai = player 1
        if (ball.y > player1 + 40) {
            player1 += 4;
        }

        if (ball.y < player1 + 40) {
            player1 -= 4;
        }

        // single player = player 2
        if (keyState['ArrowUp'] && player2 > 0) {
            player2 -= 5;
        }

        if (keyState['ArrowDown'] && player2 < 400) {
            player2 += 5;
        }
    } else {
        // multiplayer
        if (keyState['w'] && player1 > 0) {
            player1 -= 5;
        }
        if (keyState['s'] && player1 < 400) {
            player1 += 5;
        }

        if (keyState['ArrowUp'] && player2 > 0) {
            player2 -= 5;
        }

        if (keyState['ArrowDown'] && player2 < 400) {
            player2 += 5;
        }
    }

    requestAnimationFrame(movePlayers);
}

function checkPaddleCollision() {
    // left player
    if (ball.x <= 20 && ball.x >= 10 && ball.y >= player1 && ball.y <= player1 + 80) {
        ball.speedX = Math.abs(ball.speedX) * 1.1; // ball turns right
        let impact = (ball.y - (player1 + 40)) / 40;
        ball.speedY = impact * 5; // angle controll
    }

    // right player
    if (ball.x <= 690 && ball.x >= 700 && ball.y >= player2 && ball.y <= player2 + 80) {
        ball.speedX = -Math.abs(ball.speedX) * 1.1; // ball turns left
        let impact = (ball.y - (player2 + 40)) / 40;
        ball.speedY = impact * 5; // angle controll
    }

    // calc max speed
    const maxSpeed = 8;
    ball.speedX = Math.sign(ball.speedX) * Math.min(Math.abs(ball.speedX), maxSpeed);
    ball.speedY = Math.sign(ball.speedY) * Math.min(Math.abs(ball.speedY), maxSpeed);
}

function resetBall(scoringPlayer) {
    if (scoringPlayer === 1) scorePlayer1++; // points player 1
    if (scoringPlayer === 2) scorePlayer2++; // points player 2

    ball = {
        x: 360,
        y: 240,
        speedX: 3 * (Math.random() < 0.5 ? 1 : -1), // random direction
        speedY: (Math.random() - 0.5) * 4 // random angel
    };
}

function loop() {
    // move ball
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // collision tracker
    checkPaddleCollision();

    // ball hit top or bottom gamaeboard
    if (ball.y < 0 || ball.y > 470) {
        ball.speedY = -ball.speedY;
    }

    // reset ball
    if (ball.x < 0) {
        resetBall(2); // Punkt für Spieler 2
    }

    if (ball.x > 720) {
        resetBall(1); // Punkt für Spieler 1
    }
}

// execute
draw();
setInterval(loop, 1000 / 60);
movePlayers();
