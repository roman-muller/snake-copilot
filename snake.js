// Get the canvas element and its 2D rendering context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Define the size of each grid box
const box = 20;

// Initialize the snake with one segment at a specific position
const snake = [{ x: 9 * box, y: 10 * box }];

// Variable to store the current direction of the snake
let direction = null;

// Generate the initial position of the food randomly
let food = {
  x: Math.floor(Math.random() * 20) * box,
  y: Math.floor(Math.random() * 20) * box,
};

// Generate random obstacles
const obstacles = [];
for (let i = 0; i < 5; i++) {
  obstacles.push({
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box,
  });
}

// Variable to keep track of the player's score
let score = 0;

// Function to draw the game elements (snake, food, obstacles, and score)
function draw() {
  // Clear the canvas by filling it with a black background
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "lime" : "white";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = "#000";
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw the food as a red square
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // Draw the obstacles as gray squares
  ctx.fillStyle = "gray";
  for (let i = 0; i < obstacles.length; i++) {
    ctx.fillRect(obstacles[i].x, obstacles[i].y, box, box);
  }

  // Get the current position of the snake's head
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // Update the position of the snake's head based on the direction
  if (direction === "LEFT") snakeX -= box;
  if (direction === "UP") snakeY -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "DOWN") snakeY += box;

  // Check if the snake eats the food
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box,
    };

    // Add a new random obstacle after eating food
    obstacles.push({
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box,
    });
  } else {
    // If the snake doesn't eat the food, remove the last segment (tail)
    snake.pop();
  }

  // Create a new head for the snake at the updated position
  const newHead = { x: snakeX, y: snakeY };

  // Check for game over conditions:
  // 1. Snake hits the wall
  // 2. Snake collides with itself
  // 3. Snake collides with an obstacle
  if (
    snakeX < 0 || // Left wall
    snakeY < 0 || // Top wall
    snakeX >= canvas.width || // Right wall
    snakeY >= canvas.height || // Bottom wall
    collision(newHead, snake) || // Collision with itself
    collision(newHead, obstacles) // Collision with obstacles
  ) {
    clearInterval(game); // Stop the game loop
    alert(`Game Over! Your score: ${score}`); // Show the final score
  }

  // Add the new head to the snake
  snake.unshift(newHead);

  // Display the score on the canvas
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 20);
}

// Function to check if the snake collides with itself or obstacles
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true; // Collision detected
    }
  }
  return false; // No collision
}

// Event listener to control the snake's direction using arrow keys
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// Start the game loop, which runs the `draw` function every 100 milliseconds
const game = setInterval(draw, 100);