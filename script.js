let currentQuestion = null;
let score = 0;
let timer = 30;

document.addEventListener("DOMContentLoaded", () => {
  loadQuestion();
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
  const pressedKeys = new Set();
  if (event.metaKey) pressedKeys.add("meta");
  if (event.ctrlKey) pressedKeys.add("ctrl");
  if (event.shiftKey) pressedKeys.add("shift");
  if (event.altKey) pressedKeys.add("alt");
  pressedKeys.add(event.key.toLowerCase());

  const expectedKeys = new Set(currentQuestion.keys);
  const isCorrect = pressedKeys.size === expectedKeys.size &&
    [...pressedKeys].every(k => expectedKeys.has(k));

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
