let currentQuestion = null;
let score = 0;
let timer = 30;
const pressed = new Set();

const keys = [
  [{k:'esc'},{k:'f1'},{k:'f2'},{k:'f3'},{k:'f4'},{k:'f5'},{k:'f6'},{k:'f7'},{k:'f8'},{k:'f9'},{k:'f10'},{k:'f11'},{k:'f12'},{k:'delete'}],
  [{k:'`'},{k:'1'},{k:'2'},{k:'3'},{k:'4'},{k:'5'},{k:'6'},{k:'7'},{k:'8'},{k:'9'},{k:'0'},{k:'-'},{k:'='},{k:'delete'}],
  [{k:'tab',w:'w1_5'},{k:'q'},{k:'w'},{k:'e'},{k:'r'},{k:'t'},{k:'y'},{k:'u'},{k:'i'},{k:'o'},{k:'p'},{k:'['},{k:']'},{k:'\\'}],
  [{k:'caps lock',w:'w2'},{k:'a'},{k:'s'},{k:'d'},{k:'f'},{k:'g'},{k:'h'},{k:'j'},{k:'k'},{k:'l'},{k:';'},{k:"'"},{k:'return',w:'w2'}],
  [{k:'shift',w:'w2_5'},{k:'z'},{k:'x'},{k:'c'},{k:'v'},{k:'b'},{k:'n'},{k:'m'},{k:','},{k:'.'},{k:'/'},{k:'shift',w:'w2_5'}],
  [
    {k:'fn'},{k:'control',d:'⌃'},{k:'option',d:'⌥'},{k:'command',d:'⌘',w:'w1_5'},
    {k:'space',d:'␣',w:'w5'},
    {k:'command',d:'⌘',w:'w1_5'},{k:'option',d:'⌥'},
    {k:'arrowleft',d:'←'},{k:'arrowup',d:'↑'},{k:'arrowdown',d:'↓'},{k:'arrowright',d:'→'}
  ]
];

document.addEventListener("DOMContentLoaded", () => {
  drawKeyboard();
  loadQuestion();
  setInterval(updateTimer, 1000);
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
});

function drawKeyboard() {
  const container = document.getElementById("keyboard");
  keys.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "row";
    row.forEach(k => {
      const div = document.createElement("div");
      div.className = `key w${k.w || 1}`;
      div.textContent = k.d || k.k;
      div.dataset.key = k.k.toLowerCase();
      rowDiv.appendChild(div);
    });
    container.appendChild(rowDiv);
  });
}

function handleKeyDown(e) {
  const key = normalizeKey(e);
  if (!pressed.has(key)) {
    pressed.add(key);
    activateKey(key);
  }

  // 正解判定（すべて押されたとき）
  if (!currentQuestion) return;
  const expected = new Set(currentQuestion.keys);
  const correct = expected.size === pressed.size && [...expected].every(k => pressed.has(k));
  const feedback = document.getElementById("feedback");
  if (correct) {
    feedback.innerHTML = `<span style="color: green;">正解！</span>`;
    score++;
    document.getElementById("score").textContent = score;
    pressed.clear();
    clearAllActive();
    loadQuestion();
  }
}

function handleKeyUp(e) {
  const key = normalizeKey(e);
  pressed.delete(key);
  deactivateKey(key);
}

function activateKey(key) {
  const el = document.querySelector(`.key[data-key="${key}"]`);
  if (el) el.classList.add("active");
}
function deactivateKey(key) {
  const el = document.querySelector(`.key[data-key="${key}"]`);
  if (el) el.classList.remove("active");
}
function clearAllActive() {
  document.querySelectorAll(".key").forEach(k => k.classList.remove("active"));
}

function normalizeKey(e) {
  if (e.key === " ") return "space";
  if (e.key === "Meta") return "command";
  if (e.key === "Alt") return "option";
  if (e.key === "Control") return "control";
  if (e.key === "Shift") return "shift";
  if (e.key.startsWith("Arrow")) return e.key.toLowerCase();
  return e.key.toLowerCase();
}

function loadQuestion() {
  fetch('shortcuts.json')
    .then(res => res.json())
    .then(data => {
      const index = Math.floor(Math.random() * data.length);
      currentQuestion = data[index];
      document.getElementById("question").textContent = currentQuestion.description;
    });
}

function updateTimer() {
  if (timer <= 0) return;
  timer--;
  document.getElementById("timer").textContent = timer;
  if (timer === 0) {
    document.getElementById("question").textContent = "時間切れ！";
    document.removeEventListener("keydown", handleKeyDown);
    document.removeEventListener("keyup", handleKeyUp);
  }
}