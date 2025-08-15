const getBtn = document.getElementById("getQst");
const nextBtn = document.getElementById("nextQst");
const trivia_txt = document.getElementById("trivia__txt");
const choices__container = document.querySelector(".trivia__choices");
let numberChecker = [];
let indicator = 0;
let isStarting = false;
let score = 0;

// support funciton

function triviaSettings() {
  let amount = document.querySelector(".trivia__amount");
  let category = document.querySelector(".trivia__category");
  let difficulty = document.querySelector(".trivia__difficulty");
  return [amount.value, category.value, difficulty.value];
}

function choicesRandomizer() {
  while (true) {
    let randomize = Math.floor(Math.random() * 4) + 1;
    if (numberChecker.includes(randomize)) {
      continue;
    } else {
      numberChecker.push(randomize);
      return randomize;
    }
  }
}

function disableChoices() {
  choices__container.classList.toggle("disable");
  nextBtn.classList.toggle("show");
}

function createTrivia(correct, choices, randomize) {
  let choice = document.createElement("div");

  choice.innerHTML = choices[randomize];
  choice.classList.add("choice");
  choice.dataset.choice = choices[randomize];

  choice.addEventListener("click", (e) => {
    let choices = document.querySelectorAll(".choice");
    let answer = e.target;

    if (answer.dataset.choice !== correct) {
      answer.classList.add("incorrect");
      choices.forEach((element) => {
        if (element.dataset.choice === correct) {
          element.classList.add("correct");
        }
      });
      disableChoices();
      return;
    }

    disableChoices();
    answer.classList.add("correct");
  });

  return choice;
}

async function getTrivia(amount, category, difficulty) {
  const result = await fetch(
    `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`
  );
  const data = await result.json();
  return data;
}

//
// trivia process
//

getBtn.addEventListener("click", processTrivia);
nextBtn.addEventListener("click", (e) => {
  disableChoices();
  trivia_txt.innerHTML = " ";
  choices__container.innerHTML = " ";
  processTrivia();
});

async function processTrivia() {
  let settings = triviaSettings();

  if (!localStorage.getItem("quizStatus")) {
    if (!isStarting) {
      isStarting = true;
      localStorage.setItem("quizStatus", isStarting);
      let data = await getTrivia(settings[0], settings[1], settings[2]);
      localStorage.setItem("currentQst", JSON.stringify(data.results));
    }
  }

  let current_trivia = JSON.parse(localStorage.getItem("currentQst"));

  if (current_trivia && indicator == current_trivia.length - 1) {
    localStorage.removeItem("quizStatus");
    localStorage.removeItem("currentQst");
    indicator = 0;
    getBtn.style.display = "inline";
    return;
  }

  processCurrentTrivia(current_trivia, showTrivia); // call 1

  if (localStorage.getItem("quizStatus")) {
    getBtn.style.display = "none";
  }
}

function processCurrentTrivia(trivia, showCurrentTrivia) {
  // call 2
  let current_trivia = trivia[indicator];
  let next = showCurrentTrivia(current_trivia, choicesRandomizer);
  if (next) {
    ++indicator;
  }
}

function showTrivia(trivia, random) {
  // call 3
  trivia_txt.innerHTML = trivia.question;
  let choices = trivia["incorrect_answers"].concat(trivia.correct_answer);

  for (let i = 0; i < choices.length; i++) {
    if (numberChecker.length == 4) {
      numberChecker = [];
    }
    let randomize = random() - 1;
    let choice = createTrivia(trivia["correct_answer"], choices, randomize);
    choices__container.append(choice);
  }

  return true;
}
 