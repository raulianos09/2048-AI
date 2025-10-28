import { Grid } from "./grid";
import { render } from "./ui";
import "swiped-events";
import { initOverlay, showOverlay, hideOverlay } from "./components/overlay/overlay";


let grid: Grid;
let score = 0;

// --------------------
// Score Management
// --------------------
function updateScore(points: number) {
    score += points;
    const scoreEl = document.getElementById("score");
    if (scoreEl) scoreEl.textContent = score.toString();
}

function resetScore() {
    score = 0;
    const scoreEl = document.getElementById("score");
    if (scoreEl) scoreEl.textContent = score.toString();
}

// Create score display above the board if not already
let scoreEl = document.getElementById("score");
if (!scoreEl) {
    scoreEl = document.createElement("div");
    scoreEl.id = "score";
    scoreEl.style.fontWeight = "bold";
    scoreEl.style.fontSize = "1.25rem";
    scoreEl.style.color = "#776e65";
    scoreEl.style.marginBottom = "10px";
    document.body.insertBefore(scoreEl, document.getElementById("game-board"));
}

// --------------------
// Start / Restart Game
// --------------------
function startGame(size: number) {
    resetScore();
    hideOverlay();

    const board = document.getElementById("game-board")!;
    board.classList.add("resizing");

    grid = new Grid(size);
    grid.addRandomTile();
    grid.addRandomTile();

    board.style.setProperty("--board-size", size.toString());
    render(grid);
    resizeBoard();

    setTimeout(() => board.classList.remove("resizing"), 400);
}

// --------------------
// Move Helper
// --------------------
function handleMove(action: () => { moved: boolean; score: number }) {
    const { moved, score: points } = action();
    if (moved) {
        if (points > 0) updateScore(points);
        grid.addRandomTile();
        render(grid);
        if (grid.isGameOver()) showOverlay(score);
    }
}

// --------------------
// Keyboard Input
// --------------------
document.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp": handleMove(() => grid.moveUp()); break;
        case "ArrowDown": handleMove(() => grid.moveDown()); break;
        case "ArrowLeft": handleMove(() => grid.moveLeft()); break;
        case "ArrowRight": handleMove(() => grid.moveRight()); break;
    }
});

// --------------------
// Swipe Input
// --------------------
document.addEventListener("swiped-left", () => handleMove(() => grid.moveLeft()));
document.addEventListener("swiped-right", () => handleMove(() => grid.moveRight()));
document.addEventListener("swiped-up", () => handleMove(() => grid.moveUp()));
document.addEventListener("swiped-down", () => handleMove(() => grid.moveDown()));

// --------------------
// Mouse Drag Input
// --------------------
let startX = 0;
let startY = 0;
let isDragging = false;

document.addEventListener("mousedown", (e) => {
    startX = e.clientX;
    startY = e.clientY;
    isDragging = true;
});

document.addEventListener("mouseup", (e) => {
    if (!isDragging) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (Math.abs(dx) < 30 && Math.abs(dy) < 30) {
        isDragging = false;
        return;
    }

    if (Math.abs(dx) > Math.abs(dy)) {
        handleMove(() => dx > 0 ? grid.moveRight() : grid.moveLeft());
    } else {
        handleMove(() => dy > 0 ? grid.moveDown() : grid.moveUp());
    }

    isDragging = false;
});

// --------------------
// Overlay Initialization
// --------------------
initOverlay(() => {
    const size = parseInt((document.getElementById("board-size") as HTMLInputElement).value);
    startGame(size);
});

// --------------------
// Controls: Slider & Button
// --------------------
const sizeSlider = document.getElementById("board-size") as HTMLInputElement;
const sizeValue = document.getElementById("board-size-value")!;
const sizeValue2 = document.getElementById("board-size-value-2")!;
const newGameBtn = document.getElementById("new-game") as HTMLButtonElement;

sizeSlider.addEventListener("input", () => {
    const size = parseInt(sizeSlider.value);
    sizeValue.textContent = size.toString();
    sizeValue2.textContent = size.toString();
    startGame(size);
});

newGameBtn.addEventListener("click", () => {
    const size = parseInt(sizeSlider.value);
    startGame(size);
});

// --------------------
// Responsive Board
// --------------------
function resizeBoard() {
    const board = document.getElementById("game-board")!;
    const header = document.querySelector("h1")!;
    const controls = document.querySelector(".controls")!;
    const usedVerticalSpace = header.offsetHeight + controls.clientHeight + 100;
    const availableWidth = window.innerWidth - 40;
    const availableHeight = window.innerHeight - usedVerticalSpace;
    const gridSize = Math.min(availableWidth, availableHeight);
    board.style.width = `${gridSize}px`;
    board.style.height = `${gridSize}px`;
    const boardSize = parseInt(getComputedStyle(board).getPropertyValue("--board-size")) || 4;
    const tileSize = gridSize / boardSize - 10;
    board.style.setProperty("--tile-size", `${tileSize}px`);
}

window.addEventListener("resize", resizeBoard);
resizeBoard();

// --------------------
// Start Default Game
// --------------------
startGame(4);
