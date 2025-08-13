const getBtn = document.getElementById("getQst");
const nextBtn = document.getElementById("nextQst");
const trivia_txt = document.getElementById("trivia_txt");
const choices__container = document.querySelector(".trivia__choices");
let numberChecker = [];
let isStarting = false;

// support funciton

function triviaDetails() {
  let amount = document.querySelector(".trivia__amount");
  let category = document.querySelector(".trivia__category");
  let difficulty = document.querySelector(".trivia__difficulty");
  return [amount.value, category.value, difficulty.value];
}

function randomizer() {
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

async function getTrivia(amount, category, difficulty) {
  const result = await fetch(
    `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`
  );
  const data = await result.json();
  return data;
}

// trivia process

getBtn.addEventListener("click", async (e) => {
  let trivia_details = triviaDetails();

  if (!localStorage.getItem("quizStatus")) {
    if (!isStarting) {
      isStarting = true;
      localStorage.setItem("quizStatus", isStarting);
      let data = await getTrivia(
        trivia_details[0],
        trivia_details[1],
        trivia_details[2]
      );
      localStorage.setItem("currentQst", JSON.stringify(data.results));
    }
  }

  let current_trivia = JSON.parse(localStorage.getItem("currentQst"));
  currentTrivia(current_trivia, showTrivia); // note

  if (localStorage.getItem("quizStatus")) {
    getBtn.style.display = "none";
    nextBtn.style.display = "inline";
  }
});

function currentTrivia(trivia, show) {
  let indicator = 0; // kailangan mag increase to pag pinindot na ung next
  let current_trivia = trivia[indicator];
  show(current_trivia, randomizer);
}

function showTrivia(trivia, random) {
  // dapat mag return ng true or false pag tapos na next question
  document.getElementById("trivia__txt").innerHTML = trivia.question;
  let choices = trivia["incorrect_answers"].concat(trivia.correct_answer);

  for (let i = 0; i < choices.length; i++) {
    if (numberChecker.length == 4) {
      numberChecker = [];
    }

    let randomize = random(); // for displaying the choices
    let choice = document.createElement("div");
    choice.innerHTML = choices[randomize - 1];
    choice.dataset.choice = choices[randomize - 1];
    choice.addEventListener("click", (e) => {
      console.log(e.target.dataset);
      if(e.target.dataset.choice == trivia.correct_answer) console.log('correct');
      else console.log('wrong');
      
      
    });

    choices__container.append(choice);
  }
}

