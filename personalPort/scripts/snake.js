const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

if (!ctx) {
  console.error("Canvas 2D context couldn't be initialized");
}

canvas.width = 600;
canvas.height = 600;

const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

const snakeColors = ["#0f0", "#00f", "#f0f", "#ff0", "#0ff", "#f00"];
let currentSnakeColorIndex = 0;
let snakeColor = snakeColors[currentSnakeColorIndex];
const foodColor = "#f00";

let snake;
let dx;
let dy;
let food;
let score;
let gameInterval;
let isGameOver = false;
let highScore = 0;

// Play Again button
const playAgainBtn = document.getElementById("playAgainBtn");

// Start the game and initialize variables
function startGame() {
  snake = [{ x: 5 * scale, y: 5 * scale }];
  dx = scale;
  dy = 0;
  score = 0;
  isGameOver = false;
  food = {
    x: Math.floor(Math.random() * columns) * scale,
    y: Math.floor(Math.random() * rows) * scale,
  };

  showScore();
  clearGameOverMessage();
  playAgainBtn.style.display = "none";
  gameInterval = setInterval(updateGame, 100);
}

// Event listener for the Start and Play Again buttons
document.getElementById("startBtn").addEventListener("click", startGame);
playAgainBtn.addEventListener("click", startGame);

function updateGame() {
  if (isGameOver) return;

  moveSnake();
  if (checkCollision()) {
    clearInterval(gameInterval);
    isGameOver = true;
    showGameOverMessage();
    if (score > highScore) {
      highScore = score;
      addScoreToBox();
    }
    return;
  }
  if (checkFoodEaten()) {
    score++;
    showScore();
    growSnake();
    repositionFood();

    currentSnakeColorIndex = (currentSnakeColorIndex + 1) % snakeColors.length;
    snakeColor = snakeColors[currentSnakeColorIndex];
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawFood();
  drawSnake();
}

function showGameOverMessage() {
  let flash = true;

  const gameOverInterval = setInterval(() => {
    if (!isGameOver) {
      clearInterval(gameOverInterval);
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (flash) {
      ctx.fillStyle = "red";
      ctx.font = "75px Doto";
      ctx.textAlign = "center";
      ctx.fillText("YOU LOSE!", canvas.width / 2, canvas.height / 2);
    }
    flash = !flash;
  }, 500);

  setTimeout(() => {
    clearInterval(gameOverInterval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    playAgainBtn.style.display = "block";
  }, 5000);
}

function clearGameOverMessage() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);
  snake.pop();
}

function changeDirection(event) {
  const LEFT_KEY = 37;
  const UP_KEY = 38;
  const RIGHT_KEY = 39;
  const DOWN_KEY = 40;
  const keyPressed = event.keyCode;

  if (keyPressed === LEFT_KEY && dx === 0) {
    dx = -scale;
    dy = 0;
  }
  if (keyPressed === UP_KEY && dy === 0) {
    dx = 0;
    dy = -scale;
  }
  if (keyPressed === RIGHT_KEY && dx === 0) {
    dx = scale;
    dy = 0;
  }
  if (keyPressed === DOWN_KEY && dy === 0) {
    dx = 0;
    dy = scale;
  }
}

function checkCollision() {
  const head = snake[0];
  const hitLeftWall = head.x < 0;
  const hitRightWall = head.x >= canvas.width;
  const hitTopWall = head.y < 0;
  const hitBottomWall = head.y >= canvas.height;

  if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
    return true;
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }
  return false;
}

function checkFoodEaten() {
  const head = snake[0];
  return head.x === food.x && head.y === food.y;
}

function growSnake() {
  const tail = snake[snake.length - 1];
  snake.push({ x: tail.x, y: tail.y });
}

function repositionFood() {
  food.x = Math.floor(Math.random() * columns) * scale;
  food.y = Math.floor(Math.random() * rows) * scale;
  for (let segment of snake) {
    if (segment.x === food.x && segment.y === food.y) {
      repositionFood();
      break;
    }
  }
}

function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.fillRect(food.x, food.y, scale, scale);
}

function drawSnake() {
  ctx.fillStyle = snakeColor;
  for (let segment of snake) {
    ctx.fillRect(segment.x, segment.y, scale, scale);
  }
}

function showScore() {
  const scoreDisplay = document.getElementById("scoreDisplay");
  if (scoreDisplay) {
    scoreDisplay.textContent = score;
  }
}

function addScoreToBox() {
  const gameHistory = document.getElementById("gameHistory");
  gameHistory.innerHTML = `<h3>HighScore: ${highScore}</h3>`;
}

// Attach the keyboard event listener for changing direction
window.addEventListener("keydown", changeDirection);