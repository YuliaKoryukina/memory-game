const header = document.createElement("header");
header.style.backgroundColor = "#1f3a5f";
header.style.minHeight = "15vh";
header.style.display = "flex";
header.style.alignItems = "center";
header.style.gap = "16px";
header.style.padding = "0 24px";

const button1 = document.createElement("button");
button1.textContent = "Новая игра";
button1.style.color = "#1f3a5f";
button1.style.backgroundColor = "#f4efe6";
button1.style.border = "none";
button1.style.padding = "10px 16px";
button1.style.borderRadius = "8px";
button1.style.cursor = "pointer";

const button2 = document.createElement("button");
button2.textContent = "Таблица Лидеров";
button2.style.color = "#1f3a5f";
button2.style.backgroundColor = "#f4efe6";
button2.style.border = "none";
button2.style.padding = "10px 16px";
button2.style.borderRadius = "8px";
button2.style.cursor = "pointer";

const main = document.createElement("main");
main.style.backgroundColor = "#f4efe6";
main.style.minHeight = "100vh";
main.style.display = "grid";
main.style.gridTemplateColumns = "repeat(4, 100px)";
main.style.gap = "12px";
main.style.justifyContent = "center";
main.style.alignContent = "center";

header.append(button1, button2);
document.body.append(header, main);

function generateCards() {
  const icons = [
    "\u{1F680}",
    "\u{1F355}",
    "\u{1F431}",
    "\u{1F3B8}",
    "\u{1F335}",
    "\u{1F389}",
    "\u{1F4BB}",
    "\u{2615}",
  ];
  const pairIcons = icons.concat(icons);

  // перемешка
  for (let i = pairIcons.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    let temp = pairIcons[i];
    pairIcons[i] = pairIcons[j];
    pairIcons[j] = temp;
  }
  return pairIcons;
}
const shuffledIcons = generateCards();
for (let i = 0; i < 16; i++) {
  const card = document.createElement("button");
  card.style.width = "100px";
  card.style.height = "100px";
  card.style.backgroundColor = "#1f3a5f";
  card.style.border = "none";
  card.style.borderRadius = "12px";
  card.style.fontSize = "40px";
  card.style.cursor = "pointer";
  card.dataset.icon = shuffledIcons[i];
  main.append(card);
}
//переменные чтобы запомнить, что происходит 
let firstCard = null;
let secondCard = null;
let isLocked = false;
let moves = 0;
let pairs = 0;
let isGameFinished = false;
let closeTimer = null;

// счётчики над карточками
const counters = document.createElement("div");
counters.style.display = "flex";
counters.style.justifyContent = "center";
counters.style.gap = "24px";
counters.style.padding = "16px";
counters.style.backgroundColor = "#f4efe6";
counters.style.color = "#1f3a5f";
counters.style.fontSize = "20px";

const movesText = document.createElement("p");
movesText.textContent = "Ходы: " + moves;
movesText.style.margin = "0";

const pairsText = document.createElement("p");
pairsText.textContent = "Пары: " + pairs + " из 8";
pairsText.style.margin = "0";

counters.append(movesText, pairsText);

// блок со счётчиками перед игровым полем
document.body.insertBefore(counters, main);

// клик на карточку
function openCard(card) {
  if (isLocked || isGameFinished || secondCard !== null) {
    return;
  }
  if (card === firstCard || card.dataset.matched === "yes") {
    return;
  }
  card.textContent = card.dataset.icon;
  if (firstCard === null) {
    firstCard = card;
    return;
  }

  secondCard = card;

  moves = moves + 1;
  movesText.textContent = "Ходы: " + moves;

  // картинки разные - прячем их через секунду
  if (firstCard.dataset.icon !== secondCard.dataset.icon) {
    isLocked = true;

    closeTimer = setTimeout(function () {
      firstCard.textContent = "";
      secondCard.textContent = "";
      firstCard = null;
      secondCard = null;
      isLocked = false;
      closeTimer = null;
    }, 1000);
    return;
  }

  // картинки одинаковые - оставляем открытыми и идём дальше
  firstCard.dataset.matched = "yes";
  secondCard.dataset.matched = "yes";
  firstCard = null;
  secondCard = null;

  pairs = pairs + 1;
  pairsText.textContent = "Пары: " + pairs + " из 8";

  if (pairs === 8) {
    isGameFinished = true;
    openWinWindow();
  }
}
const cards = main.querySelectorAll("button");

for (let i = 0; i < cards.length; i++) {
  cards[i].addEventListener("click", function () {
    openCard(cards[i]);
  });
}

//окно модальное для победы и лидеров
const modalOverlay = document.createElement("div");
modalOverlay.style.position = "fixed";
modalOverlay.style.left = "0";
modalOverlay.style.top = "0";
modalOverlay.style.width = "100%";
modalOverlay.style.height = "100%";
modalOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
modalOverlay.style.display = "none";
modalOverlay.style.alignItems = "center";
modalOverlay.style.justifyContent = "center";
modalOverlay.style.zIndex = "10";

const modalBox = document.createElement("div");
modalBox.style.backgroundColor = "#f4efe6";
modalBox.style.padding = "24px";
modalBox.style.borderRadius = "12px";
modalBox.style.textAlign = "center";
modalBox.style.color = "#1f3a5f";

modalOverlay.append(modalBox);
document.body.append(modalOverlay);

function openModal(content) {
  modalBox.replaceChildren(content);
  modalOverlay.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modalOverlay.style.display = "none";
  document.body.style.overflow = "";
}

// клик по тёмному фону закрывает окно, клик по тексту внутри — нет
modalOverlay.addEventListener("click", function (event) {
  if (event.target === modalOverlay) {
    closeModal();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeModal();
  }
});

function styleModalButton(button) {
  button.style.padding = "10px 16px";
  button.style.border = "none";
  button.style.borderRadius = "8px";
  button.style.backgroundColor = "#1f3a5f";
  button.style.color = "#f4efe6";
  button.style.cursor = "pointer";
}

function createCloseButton() {
  const button = document.createElement("button");
  button.textContent = "Закрыть";
  styleModalButton(button);
  button.addEventListener("click", function () {
    closeModal();
  });
  return button;
}

function createWinContent() {
  const wrap = document.createElement("div");

  const title = document.createElement("p");
  title.textContent = "Победа!";
  title.style.fontSize = "24px";
  title.style.margin = "0 0 8px";

  const movesLine = document.createElement("p");
  movesLine.textContent = "Ходы: " + moves;
  movesLine.style.margin = "0 0 16px";

  const newGameButton = document.createElement("button");
  newGameButton.textContent = "Новая игра";
  newGameButton.style.marginRight = "8px";
  styleModalButton(newGameButton);

  wrap.append(title, movesLine, newGameButton, createCloseButton());
  return wrap;
}

function openWinWindow() {
  openModal(createWinContent());
}

function formatDate(playedAt) {
  const date = new Date(playedAt);
  let day = date.getDate();
  let month = date.getMonth() + 1;
  const year = date.getFullYear();

  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }

  return day + "." + month + "." + year;
}

function getResults() {
  const text = localStorage.getItem("memoryGameResults");
  if (text === null) {
    return [];
  }
  return JSON.parse(text);
}

function createLeaderboardContent() {
  const wrap = document.createElement("div");

  const title = document.createElement("p");
  title.textContent = "Таблица лидеров";
  title.style.fontSize = "24px";
  title.style.margin = "0 0 12px";
  wrap.append(title);

  const results = getResults();
  const sorted = results.slice();

  // меньше ходов — выше; при равенстве раньше сыгранная игра выше
  sorted.sort(function (a, b) {
    if (a.moves !== b.moves) {
      return a.moves - b.moves;
    }
    return a.playedAt - b.playedAt;
  });

  const top = sorted.slice(0, 10);

  if (top.length === 0) {
    const emptyText = document.createElement("p");
    emptyText.textContent = "Пока нет результатов";
    emptyText.style.margin = "0 0 16px";
    wrap.append(emptyText);
  } else {
    const table = document.createElement("table");
    table.style.width = "100%";
    table.style.borderCollapse = "collapse";
    table.style.marginBottom = "16px";

    const headerRow = document.createElement("tr");
    const headers = ["Место", "Ходы", "Дата"];

    for (let i = 0; i < headers.length; i++) {
      const cell = document.createElement("th");
      cell.textContent = headers[i];
      cell.style.padding = "6px 10px";
      headerRow.append(cell);
    }
    table.append(headerRow);

    for (let i = 0; i < top.length; i++) {
      const row = document.createElement("tr");

      const placeCell = document.createElement("td");
      placeCell.textContent = String(i + 1);

      const movesCell = document.createElement("td");
      movesCell.textContent = String(top[i].moves);

      const dateCell = document.createElement("td");
      dateCell.textContent = formatDate(top[i].playedAt);

      placeCell.style.padding = "6px 10px";
      movesCell.style.padding = "6px 10px";
      dateCell.style.padding = "6px 10px";

      row.append(placeCell, movesCell, dateCell);
      table.append(row);
    }

    wrap.append(table);
  }

  wrap.append(createCloseButton());
  return wrap;
}

button2.addEventListener("click", function () {
  openModal(createLeaderboardContent());
});
