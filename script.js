const getBtn = document.getElementById("getQst");
const trivia_txt = document.getElementById("trivia_txt");
const choices__container = document.querySelector(".trivia__choices");
let isStarting = false;

async function getTrivia(amount, category, difficulty) {
  console.log("fetching");

  const result = await fetch(
    `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`
  );
  const data = await result.json();
  return data;
}

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
  currentTrivia(current_trivia);
});

function triviaDetails() {
  let amount = document.querySelector(".trivia__amount");
  let category = document.querySelector(".trivia__category");
  let difficulty = document.querySelector(".trivia__difficulty");
  return [amount.value, category.value, difficulty.value];
}

function currentTrivia(trivia) {
  let indicator = 0;
  let current_trivia = trivia[indicator];
  showTrivia(current_trivia);
}

function showTrivia(trivia) {
  document.getElementById("trivia__txt").innerHTML = trivia.question;
  let choices = trivia["incorrect_answers"].concat(trivia.correct_answer);
  
  for (let i = 0; i < choices.length - 1; i++) {
    let number = []
    let randomize = Math.floor(Math.random() * 4) - 1;
    let choice = document.createElement("div");

    choice.innerHTML = choices[randomize];
    console.log(choice);
    choices__container.append(choice)
  }
}

function checkAnswer() {}
