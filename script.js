// ==========================
// DOM ELEMENTS
// ==========================
const getBtn = document.getElementById("getQst");
const nextBtn = document.getElementById("nextQst");
const triviaText = document.getElementById("trivia__txt");
const choicesContainer = document.querySelector(".trivia__choices");
const nav = document.querySelector(".nav");
const navToggle = document.querySelector(".nav__toggle");

// ==========================
// STATE VARIABLES
// ==========================
let numberChecker = [];
let questionIndex = 0;
let isStarting = false;

// ==========================
// UTILITY FUNCTIONS
// ==========================

// Get trivia settings from form inputs
function getTriviaSettings() {
  return [
    document.querySelector(".trivia__amount").value,
    document.querySelector(".trivia__category").value,
    document.querySelector(".trivia__difficulty").value
  ];
}

// Generate unique random position for choices
function getRandomChoiceIndex() {
  while (true) {
    const randomIndex = Math.floor(Math.random() * 4) + 1;
    if (!numberChecker.includes(randomIndex)) {
      numberChecker.push(randomIndex);
      return randomIndex;
    }
  }
}

// Disable further choice selection and show "Next" button
function disableChoices() {
  choicesContainer.classList.toggle("disable");
  nextBtn.classList.toggle("show");
}

// Show or hide loading state on the active button
function setLoading(isLoading) {
  const nextVisible = getComputedStyle(nextBtn).display !== "none";
  const targetBtn = nextVisible ? nextBtn : getBtn;

  if (isLoading) {
    targetBtn.classList.add("btn--loading");
    targetBtn.disabled = true;
  } else {
    targetBtn.classList.remove("btn--loading");
    targetBtn.disabled = false;
  }
}

// ==========================
// TRIVIA LOGIC
// ==========================

// Create a single choice element
function createChoice(correctAnswer, choices, index) {
  const choice = document.createElement("div");
  choice.innerHTML = choices[index];
  choice.classList.add("choice");
  choice.dataset.choice = choices[index];

  choice.addEventListener("click", (e) => {
    const allChoices = document.querySelectorAll(".choice");
    const selected = e.target;

    if (selected.dataset.choice !== correctAnswer) {
      selected.classList.add("incorrect");
      allChoices.forEach((c) => {
        if (c.dataset.choice === correctAnswer) {
          c.classList.add("correct");
        }
      });
    } else {
      selected.classList.add("correct");
    }

    disableChoices();
  });

  return choice;
}

// Fetch trivia data from API
async function fetchTrivia(amount, category, difficulty) {
  try {
    setLoading(true);
    const res = await fetch(
      `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`
    );
    const data = await res.json();
    return data;
  } catch {
    triviaText.textContent = "❌ Failed to load. Check your internet and try again.";
    return null;
  } finally {
    setLoading(false);
  }
}

// Display one trivia question
function showTrivia(trivia, getRandomIndex) {
  triviaText.innerHTML = trivia.question;
  const allChoices = trivia.incorrect_answers.concat(trivia.correct_answer);

  for (let i = 0; i < allChoices.length; i++) {
    if (numberChecker.length === 4) numberChecker = [];
    const randomIndex = getRandomIndex() - 1;
    const choiceElement = createChoice(trivia.correct_answer, allChoices, randomIndex);
    choicesContainer.append(choiceElement);
  }

  return true;
}

// Process current trivia item
function processCurrentTrivia(triviaList, displayFunction) {
  const currentTrivia = triviaList[questionIndex];
  if (displayFunction(currentTrivia, getRandomChoiceIndex)) {
    questionIndex++;
  }
}

// Handle quiz progression
async function processTrivia() {
  const settings = getTriviaSettings();
  let triviaData = JSON.parse(localStorage.getItem("currentQst"));

  // If no saved trivia data, fetch new
  if (!triviaData) {
    const data = await fetchTrivia(...settings);
    if (!data || !data.results?.length) {
      triviaText.textContent = "❌ No trivia available. Try again.";
      return;
    }
    triviaData = data.results;
    localStorage.setItem("currentQst", JSON.stringify(triviaData));
    localStorage.setItem("quizStatus", true);
    questionIndex = 0;
    isStarting = true;
  }

  // If quiz finished
  if (questionIndex >= triviaData.length) {
    localStorage.clear();
    questionIndex = 0;
    getBtn.style.display = "inline";
    triviaText.textContent = "🎯 Quiz finished! Well done!";
    choicesContainer.innerHTML = "";
    return;
  }

  if (localStorage.getItem("quizStatus")) {
    getBtn.style.display = "none";
  }

  processCurrentTrivia(triviaData, showTrivia);
}

// ==========================
// EVENT LISTENERS
// ==========================
getBtn.addEventListener("click", processTrivia);

nextBtn.addEventListener("click", () => {
  disableChoices();
  triviaText.innerHTML = "";
  choicesContainer.innerHTML = "";
  processTrivia();
});

// Mobile navbar toggle
if (navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}
