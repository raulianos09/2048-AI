import { Grid } from "./grid";

export function render(grid: Grid) {
  const board = document.getElementById("game-board")!;
  board.innerHTML = ""; // clear previous render

  const size = grid.size;
  const boardWidth = board.clientWidth - 20; // subtract padding
  const tileSize = boardWidth / size - 10;   // subtract gap
  board.style.setProperty("--tile-size", `${tileSize}px`);

  grid.cells.forEach((row) => {
    row.forEach((cell) => {
      const tile = document.createElement("div");
      tile.className = "tile";

      if (cell !== 0) {
        tile.textContent = cell.toString();
        tile.style.background = getTileColor(cell);
        tile.style.color = cell <= 4 ? "#776e65" : "#f9f6f2";
      }

      board.appendChild(tile);
    });
  });
}


// Optional: nicer colors based on value
function getTileColor(value: number): string {
  switch (value) {
    case 2: return "#eee4da";
    case 4: return "#ede0c8";
    case 8: return "#f2b179";
    case 16: return "#f59563";
    case 32: return "#f67c5f";
    case 64: return "#f65e3b";
    case 128: return "#edcf72";
    case 256: return "#edcc61";
    case 512: return "#edc850";
    case 1024: return "#edc53f";
    case 2048: return "#edc22e";
    case 4096: return "#3c3a32";
    case 8192: return "#66533c";
    case 16384: return "#776e65";
    case 32768: return "#8b7d6b";
    case 65536: return "#9f8c72";
    case 131072: return "#b39b79";
    case 262144: return "#c7aa80";
    case 524288: return "#dcb988";
    case 1048576: return "#f0c890";
    default: return "#3c3a32"; // fallback for any larger value
  }
}

