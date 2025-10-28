import "./overlay.css";

export function initOverlay(onRestart: () => void) {
  const overlay = document.createElement("div");
  overlay.id = "game-over-overlay";
  overlay.className = "overlay hidden";
  overlay.innerHTML = `
    <div class="overlay-content">
      <h2>Game Over!</h2>
      <p>Your Score: <span id="final-score">0</span></p>
      <button id="restart-btn">Restart Game</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const restartBtn = overlay.querySelector("#restart-btn") as HTMLButtonElement;
  restartBtn.addEventListener("click", () => {
    overlay.classList.add("hidden");
    onRestart();
  });
}

export function showOverlay(finalScore: number) {
  const overlay = document.getElementById("game-over-overlay")!;
  const scoreEl = overlay.querySelector("#final-score")!;
  scoreEl.textContent = finalScore.toString();
  overlay.classList.remove("hidden");
}

export function hideOverlay() {
  const overlay = document.getElementById("game-over-overlay");
  if (overlay) overlay.classList.add("hidden");
}
