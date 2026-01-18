const ball = document.getElementById("ball");
const score1 = document.getElementById("score1");
const score2 = document.getElementById("score2");
const q1 = document.getElementById("q1");
const q2 = document.getElementById("q2");
const a1 = document.getElementById("a1");
const a2 = document.getElementById("a2");
const turn = document.getElementById("turn");
const restart = document.getElementById("restart");
const timer = document.getElementById("timer");
const winner = document.getElementById("winner");

const box1 = document.getElementById("box1");
const box2 = document.getElementById("box2");

const intro = document.getElementById("intro");
const startBtn = document.getElementById("startBtn");

let pos = 0.5;
let scoreJ1 = 0;
let scoreJ2 = 0;
let currentPlayer = 1;

let matchTime = 120;
let timeLeft = matchTime;
let interval;
let questionTimer = 10;
let qInterval;

function drawBall() {
  const field = document.getElementById("field");
  const fieldWidth = field.offsetWidth;
  const ballSize = 35;
  const x = pos * (fieldWidth - ballSize);
  ball.style.left = x + "px";
}

function newQuestion(player) {
  let opRand = Math.random();
  let a, b, op, correct;

  if (opRand < 0.6) {
    // ➕ ➖ FACILE
    a = Math.floor(Math.random() * 20) + 1;
    b = Math.floor(Math.random() * 20) + 1;
    op = Math.random() < 0.5 ? "+" : "-";
    correct = op === "+" ? a + b : a - b;
  } else {
    // ✖️ MULTIPLICATION SIMPLE
    a = Math.floor(Math.random() * 6) + 1; // 1 à 6
    b = Math.floor(Math.random() * 6) + 1;
    op = "×";
    correct = a * b;
  }

  const answers = [correct];
  while (answers.length < 4) {
    let wrong = correct + (Math.floor(Math.random() * 6) - 3);
    if (!answers.includes(wrong)) answers.push(wrong);
  }
  answers.sort(() => Math.random() - 0.5);

  const qBox = player === 1 ? q1 : q2;
  const aBox = player === 1 ? a1 : a2;

  qBox.innerText = `${a} ${op} ${b} = ?`;
  aBox.innerHTML = "";

  answers.forEach(ans => {
    const btn = document.createElement("button");
    btn.innerText = ans;
    btn.onclick = () => checkAnswer(player, ans, correct);
    aBox.appendChild(btn);
  });
}


function updateTimerDisplay() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  timer.innerText = `Temps : ${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}

function startMatchTimer() {
  clearInterval(interval);
  interval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

   if (timeLeft <= 0) {
  clearInterval(interval);
  clearInterval(qInterval);

  if (scoreJ1 > scoreJ2) {
    winner.innerText = "🏆 Joueur 1 gagne le match !";
  } else if (scoreJ2 > scoreJ1) {
    winner.innerText = "🏆 Joueur 2 gagne le match !";
  } else {
    winner.innerText = "🤝 Match nul !";
  }
}

  }, 1000);
}

function startQuestionTimer() {
  clearInterval(qInterval);
  questionTimer = 10;
  qInterval = setInterval(() => {
    questionTimer--;
    turn.innerText = `À toi de jouer : Joueur ${currentPlayer} (${questionTimer}s)`;

    if (questionTimer <= 0) {
      if (currentPlayer === 1) pos -= 0.1;
      else pos += 0.1;

      checkGoal();
      updateDisplay();
      switchTurn();
      startQuestionTimer();
    }
  }, 1000);
}

function setActiveBox() {
  box1.classList.remove("active");
  box2.classList.remove("active");
  if (currentPlayer === 1) box1.classList.add("active");
  else box2.classList.add("active");
}

function switchTurn() {
  currentPlayer = currentPlayer === 1 ? 2 : 1;
  setActiveBox();
}

function checkGoal() {
  if (pos <= 0) {
    scoreJ2++;
    pos = 0.5;
    winner.innerText = "BUT Joueur 2 !";
  } else if (pos >= 1) {
    scoreJ1++;
    pos = 0.5;
    winner.innerText = "BUT Joueur 1 !";
  } else {
    winner.innerText = "";
  }
}

function updateDisplay() {
  score1.innerText = `Joueur 1 : ${scoreJ1}`;
  score2.innerText = `Joueur 2 : ${scoreJ2}`;
  drawBall();
}

function checkAnswer(player, answer, correct) {
  if (player !== currentPlayer) return;

  if (answer === correct) {
    if (player === 1) pos += 0.1;
    else pos -= 0.1;
  } else {
    if (player === 1) pos -= 0.1;
    else pos += 0.1;
  }

  checkGoal();
  updateDisplay();

  newQuestion(1);
  newQuestion(2);

  switchTurn();
  startQuestionTimer();
}

function resetGame() {
  scoreJ1 = 0;
  scoreJ2 = 0;
  pos = 0.5;
  currentPlayer = 1;
  timeLeft = 120;
  winner.innerText = "";

  updateDisplay();
  newQuestion(1);
  newQuestion(2);
  updateTimerDisplay();
  startMatchTimer();
  startQuestionTimer();
  setActiveBox();
}

restart.onclick = resetGame;

startBtn.onclick = () => {
  intro.style.display = "none";
  resetGame();
};
