const emojis = ['😀','🐶','🍕','🚗','🌟','🎈','⚽','🎮'];
let cards = [...emojis, ...emojis];
let firstCard = null;
let secondCard = null;
let lock = false;
let startTime, timerInterval;

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const diff = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById('timer').textContent = formatTime(diff);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function saveBestTime(time) {
  const best = localStorage.getItem('bestTime');
  if (!best || time < best) {
    localStorage.setItem('bestTime', time);
    document.getElementById('bestTime').textContent = formatTime(time);
  }
}

function setupGame() {
  const board = document.getElementById('gameBoard');
  board.innerHTML = '';
  const shuffled = shuffle(cards);
  shuffled.forEach((emoji, index) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.dataset.emoji = emoji;
    div.dataset.index = index;
    div.addEventListener('click', flipCard);
    board.appendChild(div);
  });
  firstCard = secondCard = null;
  lock = false;
  startTimer();
}

function flipCard(e) {
  const card = e.currentTarget;
  if (lock || card.classList.contains('flipped')) return;

  card.textContent = card.dataset.emoji;
  card.classList.add('flipped');

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  lock = true;

  if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
    firstCard = secondCard = null;
    lock = false;

    if (document.querySelectorAll('.flipped').length === cards.length) {
      stopTimer();
      const time = Math.floor((Date.now() - startTime) / 1000);
      saveBestTime(time);
      setTimeout(() => alert("¡Ganaste!"), 300);
    }
  } else {
    setTimeout(() => {
      firstCard.textContent = '';
      secondCard.textContent = '';
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      firstCard = secondCard = null;
      lock = false;
    }, 1000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const best = localStorage.getItem('bestTime');
  if (best) {
    document.getElementById('bestTime').textContent = formatTime(best);
  }
  setupGame();
});