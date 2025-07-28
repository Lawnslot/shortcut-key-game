let currentQuestion = null;
let score = 0;
let timer = 30;

const keysMac = [
  ["esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "delete"],
  ["tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
  ["caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "return"],
  ["shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "shift"],
  ["control", "option", "command", "space", "command", "option"]
];

document.addEventListener("DOMContentLoaded", () => {
  loadQuestion();
  drawKeyboard();
  setInterval(updateTimer, 1000);
  document.addEventListener("keydown", handleKey);
});

function loadQuestion() {
  fetch('shortcuts.json')
    .then(res => res.json())
    .then(data => {
      const index = Math.floor(Math.random() * data.length);
      currentQuestion = data[index];
      document.getElementById("question").textContent = currentQuestion.description;
    });
}

function handleKey(event) {
  clearKeyHighlight();

  const pressedKeys = new Set();
  if (event.metaKey) pressedKeys.add("command");
  if (event.ctrlKey) pressedKeys.add("control");
  if (event.shiftKey) pressedKeys.add("shift");
  if (event.altKey) pressedKeys.add("option");

  const key = event.key.toLowerCase();
  pressedKeys.add(key);

  highlightKey(key);
  highlightKey("command", event.metaKey);
  highlightKey("control", event.ctrlKey);
  highlightKey("shift", event.shiftKey);
  highlightKey("option", event.altKey);

  const expected = new Set(currentQuestion.keys);
  const isCorrect = pressedKeys.size === expected.size &&
    [...pressedKeys].every(k => expected.has(k));

  const feedback = document.getElementById("feedback");
  if (isCorrect) {
    feedback.innerHTML = `<span style="color: green;">正解！</span>`;
    score++;
    document.getElementById("score").textContent = score;
    loadQuestion();
  } else {
    feedback.innerHTML = `<span style="color: red;">${currentQuestion.keys.join(" + ").toUpperCase()}</span>`;
  }
}

function updateTimer() {
  if (timer <= 0) return;
  timer--;
  document.getElementById("timer").textContent = timer;
  if (timer === 0) {
    document.getElementById("question").textContent = "時間切れ！";
    document.removeEventListener("keydown", handleKey);
  }
}

function drawKeyboard() {
  const container = document.getElementById("keyboard");
  keysMac.forEach(row => {
    const rowDiv = document.createElement("div");
    row.forEach(k => {
      const key = document.createElement("div");
      key.className = "key";
      key.textContent = k;
      key.dataset.key = k.toLowerCase();
      rowDiv.appendChild(key);
    });
    container.appendChild(rowDiv);
  });
}

function highlightKey(key, condition = true) {
  if (!condition) return;
  const target = document.querySelector(`.key[data-key="${key}"]`);
  if (target) target.classList.add("active");
}

function clearKeyHighlight() {
  document.querySelectorAll(".key").forEach(key => key.classList.remove("active"));
}
