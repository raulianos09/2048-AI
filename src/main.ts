import { Grid } from "./grid";
import { render } from "./ui";
import "swiped-events";
import { initOverlay, showOverlay, hideOverlay } from "./components/overlay/overlay";

let grid: Grid;
let score = 0;

// --------------------
// Memoization Caches
// --------------------
const boardCache: { [size: number]: Grid } = {};
const scoreCache: { [size: number]: number } = {};

// --------------------
// Score Management
// --------------------
function updateScore(points: number) {
    score += points;
    const scoreEl = document.getElementById("score");
    if (scoreEl) scoreEl.textContent = score.toString();
}

function setScore(val: number) {
    score = val;
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
    hideOverlay();

    // Restore from cache if exists
    if (boardCache[size]) {
        grid = boardCache[size];
        setScore(scoreCache[size] || 0);
    } else {
        grid = new Grid(size);
        grid.addRandomTile();
        grid.addRandomTile();
        setScore(0);
    }

    const board = document.getElementById("game-board")!;
    board.classList.add("resizing");

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
    }

    // Save current board and score in cache
    const size = parseInt((document.getElementById("board-size") as HTMLInputElement).value);
    boardCache[size] = grid;
    scoreCache[size] = score;

    // Always check game over
    if (grid.isGameOver()) {
        showOverlay(score); // overlay only needs the score
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
    // Clear cache for the current size
    delete boardCache[size];
    delete scoreCache[size];

    // Start a fresh game for this size
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

    // Clear cache for this size
    delete boardCache[size];
    delete scoreCache[size];

    // Start fresh game
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
