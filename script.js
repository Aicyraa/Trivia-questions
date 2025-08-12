const getBtn = document.getElementById("getQst");

async function getTrivia(amount, category, difficulty) {
  const result = await fetch(
    `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple`
  );
  const data = await result.json();
  return data;
}

getBtn.addEventListener("click", (e) => {
  let amount = document.querySelector(".trivia__amount");
  let category = document.querySelector(".trivia__category");
  let difficulty = document.querySelector(".trivia__difficulty");
  
  getTrivia(amount.value, category.value, difficulty.value);
  //let data = getTrivia(amount.value, category.value, difficulty.value);
});
