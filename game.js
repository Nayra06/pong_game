const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 10;
const PLAYER_X = 20;
const AI_X = WIDTH - PADDLE_WIDTH - 20;
const PADDLE_COLOR = '#fff';
const BALL_COLOR = '#fa3';

let playerY = HEIGHT / 2 - PADDLE_HEIGHT / 2;
let aiY = HEIGHT / 2 - PADDLE_HEIGHT / 2;

let ball = {
    x: WIDTH / 2,
    y: HEIGHT / 2,
    vx: 6 * (Math.random() > 0.5 ? 1 : -1),
    vy: 4 * (Math.random() > 0.5 ? 1 : -1)
};

let playerScore = 0;
let aiScore = 0;

// Draw functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawNet() {
    ctx.strokeStyle = '#fff4';
    ctx.lineWidth = 4;
    for (let i = 0; i < HEIGHT; i += 35) {
        ctx.beginPath();
        ctx.moveTo(WIDTH / 2, i);
        ctx.lineTo(WIDTH / 2, i + 20);
        ctx.stroke();
    }
}

function drawScore() {
    ctx.font = "32px Arial";
    ctx.fillStyle = "#fff";
    ctx.fillText(playerScore, WIDTH / 4, 50);
    ctx.fillText(aiScore, WIDTH * 3 / 4, 50);
}

// Paddle & Ball control
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerY = mouseY - PADDLE_HEIGHT / 2;

    // Clamp paddle inside canvas
    if (playerY < 0) playerY = 0;
    if (playerY + PADDLE_HEIGHT > HEIGHT) playerY = HEIGHT - PADDLE_HEIGHT;
});

// Simple AI for right paddle
function updateAI() {
    const center = aiY + PADDLE_HEIGHT / 2;
    if (ball.y < center - 20) {
        aiY -= 5;
    } else if (ball.y > center + 20) {
        aiY += 5;
    }
    // Clamp AI paddle inside canvas
    if (aiY < 0) aiY = 0;
    if (aiY + PADDLE_HEIGHT > HEIGHT) aiY = HEIGHT - PADDLE_HEIGHT;
}

// Collision detection
function paddleCollision(px, py) {
    // px: paddle x, py: paddle y
    return (
        ball.x + BALL_RADIUS > px &&
        ball.x - BALL_RADIUS < px + PADDLE_WIDTH &&
        ball.y + BALL_RADIUS > py &&
        ball.y - BALL_RADIUS < py + PADDLE_HEIGHT
    );
}

// Reset Ball
function resetBall() {
    ball.x = WIDTH / 2;
    ball.y = HEIGHT / 2;
    ball.vx = 6 * (Math.random() > 0.5 ? 1 : -1);
    ball.vy = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// Update and draw everything
function draw() {
    // Clear
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Net
    drawNet();

    // Scores
    drawScore();

    // Paddles
    drawRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_COLOR);
    drawRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_COLOR);

    // Ball
    drawCircle(ball.x, ball.y, BALL_RADIUS, BALL_COLOR);
}

function update() {
    // Move ball
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Collide with top/bottom walls
    if (ball.y - BALL_RADIUS < 0 || ball.y + BALL_RADIUS > HEIGHT) {
        ball.vy *= -1;
    }

    // Collide with paddles
    if (paddleCollision(PLAYER_X, playerY)) {
        ball.x = PLAYER_X + PADDLE_WIDTH + BALL_RADIUS; // Avoid stuck
        ball.vx *= -1.05;
        // Add some randomness
        ball.vy += (Math.random() - 0.5) * 2;
    } else if (paddleCollision(AI_X, aiY)) {
        ball.x = AI_X - BALL_RADIUS; // Avoid stuck
        ball.vx *= -1.05;
        // Add some randomness
        ball.vy += (Math.random() - 0.5) * 2;
    }

    // Score
    if (ball.x < 0) {
        aiScore++;
        resetBall();
    } else if (ball.x > WIDTH) {
        playerScore++;
        resetBall();
    }

    updateAI();
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
