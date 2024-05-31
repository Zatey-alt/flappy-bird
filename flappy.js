js_content = """
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let bird = { x: 50, y: 150, width: 68, height: 48, velocity: 0 };
const gravity = 0.3;
const jump = -4;
let pipes = [];
let frame = 0;
let score = 0;
let gameStarted = false;
let gameOver = false;
let difficulty = 'easy';
let pipeGap = 260;
let pipeSpeed = 2;

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !gameOver) {
        bird.velocity = jump;
    }
});

function setDifficulty(level) {
    difficulty = level;
    switch (level) {
        case 'easy':
            pipeGap = 260;
            pipeSpeed = 2;
            break;
        case 'hard':
            pipeGap = 195;
            pipeSpeed = 3;
            break;
        case 'advanced':
            pipeGap = 130;
            pipeSpeed = 4;
            break;
    }
    startGame();
}

function startGame() {
    document.querySelector('.difficulty-buttons').style.display = 'none';
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    frame = 0;
    score = 0;
    gameOver = false;
    gameStarted = true;
    setTimeout(gameLoop, 3000); // 3-second countdown
}

function gameLoop() {
    if (!gameStarted) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Bird
    bird.velocity += gravity;
    bird.y += bird.velocity;
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.width / 2, 0, Math.PI * 2);
    ctx.fill();

    // Pipes
    if (frame % 100 === 0) {
        let pipeY = Math.random() * (canvas.height - pipeGap);
        pipes.push({ x: canvas.width, y: pipeY });
    }
    pipes = pipes.map(pipe => ({ ...pipe, x: pipe.x - pipeSpeed })).filter(pipe => pipe.x + 50 > 0);

    pipes.forEach(pipe => {
        let gradient = ctx.createLinearGradient(pipe.x, 0, pipe.x + 50, 0);
        gradient.addColorStop(0, 'darkgreen');
        gradient.addColorStop(1, 'lightgreen');
        ctx.fillStyle = gradient;
        ctx.fillRect(pipe.x, 0, 50, pipe.y);
        ctx.fillRect(pipe.x, pipe.y + pipeGap, 50, canvas.height);

        if (bird.x + bird.width / 2 > pipe.x && bird.x - bird.width / 2 < pipe.x + 50) {
            if (bird.y - bird.height / 2 < pipe.y || bird.y + bird.height / 2 > pipe.y + pipeGap) {
                gameOver = true;
            }
        }
    });

    // Ground collision
    if (bird.y + bird.height / 2 > canvas.height || bird.y - bird.height / 2 < 0) {
        gameOver = true;
    }

    // Score
    if (frame % 100 === 0 && frame > 0) {
        score++;
    }
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    if (gameOver) {
        ctx.fillStyle = 'black';
        ctx.font = '48px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 120, canvas.height / 2);
        gameStarted = false;
        document.querySelector('.difficulty-buttons').style.display = 'block';
        return;
    }

    frame++;
    requestAnimationFrame(gameLoop);
}