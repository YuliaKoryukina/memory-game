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
  } else {
    secondCard = card;
  }
}
const cards = main.querySelectorAll("button");

for (let i = 0; i < cards.length; i++) {
  cards[i].addEventListener("click", function () {
    openCard(cards[i]);
  });
}
