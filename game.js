// Game Variables
let canvas, ctx;
let bird, pipes = [];
let gravity = 0.6, lift = -10, birdVelocity = 0;
let pipeWidth = 50, pipeGap = 150; // Adjusted pipe gap for simplicity
let gameActive = false;
let animationFrameId;
let score = 0;

document.addEventListener('DOMContentLoaded', initGame);

// Initialize Game
function initGame() {
    // Setup Canvas
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();

    bird = {
        x: canvas.width / 4,
        y: canvas.height / 2,
        radius: 20, // Circular bird
        color: '#ffeb3b',
        stroke: '#ff5722'
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'ArrowUp') {
            flap();
        }
    });

    canvas.addEventListener('click', () => {
        if (!gameActive) {
            resetGame(); // Restart game on click if game is over
        } else {
            flap(); // Flap while the game is active
        }
    });

    window.addEventListener('resize', resizeCanvas);

    // Start button event listener
    document.getElementById('startButton').addEventListener('click', startGame);
}

// Resize Canvas to Fit Screen
function resizeCanvas() {
    canvas.width = window.innerWidth; // Set canvas width to 100% of the window
    canvas.height = window.innerHeight; // Set canvas height to 100% of the window
}

// Start the Game
function startGame() {
    gameActive = true;
    hideStartScreen();
    resetGame();
}

// Reset the Game
function resetGame() {
    score = 0;
    bird.y = canvas.height / 2;
    birdVelocity = 0;
    pipes = [];
    gameActive = true;
    animationFrameId = requestAnimationFrame(gameLoop);
}

// Main Game Loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Background
    ctx.fillStyle = '#70c5ce';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Bird Gravity
    birdVelocity += gravity;
    bird.y += birdVelocity;
    drawBird();

    // Handle Pipes
    handlePipes();

    // Check Collisions
    if (checkCollision()) {
        endGame();
        return;
    }

    // Request the next frame
    if (gameActive) {
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

// Bird Flap
function flap() {
    birdVelocity = lift; // Use lift value
}

// Draw Bird as a Circle
function drawBird() {
    ctx.fillStyle = bird.color;
    ctx.strokeStyle = bird.stroke;
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}

// End the Game
function endGame() {
    gameActive = false;
    cancelAnimationFrame(animationFrameId);
    showGameOverMessage();
}

// Handle Pipes
function handlePipes() {
    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 300) {
        const pipeHeight = Math.random() * (canvas.height - pipeGap - 50) + 50;
        pipes.push({
            x: canvas.width,
            topPipe: pipeHeight,
            bottomPipe: pipeHeight + pipeGap
        });
    }

    pipes.forEach((pipe, index) => {
        pipe.x -= 2;

        // Draw Pipes with Gradient
        ctx.fillStyle = '#4caf50'; // Pipe color
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topPipe);
        ctx.fillRect(pipe.x, pipe.bottomPipe, pipeWidth, canvas.height - pipe.bottomPipe);

        // Remove off-screen pipes
        if (pipe.x + pipeWidth < 0) {
            pipes.splice(index, 1);
            score++;
        }
    });
}

// Check for Collision
function checkCollision() {
    if (bird.y + bird.radius > canvas.height || bird.y - bird.radius < 0) {
        return true; // Collision with ground or top
    }

    for (const pipe of pipes) {
        if (
            bird.x + bird.radius > pipe.x &&
            bird.x - bird.radius < pipe.x + pipeWidth &&
            (bird.y - bird.radius < pipe.topPipe || bird.y + bird.radius > pipe.bottomPipe)
        ) {
            return true; // Collision with pipes
        }
    }
    return false;
}

// Show Start Screen
function showStartScreen() {
    document.getElementById('startScreen').style.display = 'flex';
}

// Hide Start Screen
function hideStartScreen() {
    document.getElementById('startScreen').style.display = 'none';
}

// Show Game Over Message
function showGameOverMessage() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; // Semi-transparent background
    ctx.fillRect(canvas.width / 4, canvas.height / 4, canvas.width / 2, canvas.height / 2); // Centered overlay

    ctx.fillStyle = '#ff5722'; // Text color
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2 - 40); // Game Over message
    ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2); // Score
    ctx.fillText('Click to Restart', canvas.width / 2, canvas.height / 2 + 40); // Restart instruction
}
