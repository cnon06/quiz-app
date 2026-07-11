let counterLine;
let counter;

function Question(questText, answerSelection, correctAnswer) {
  this.questText = questText;
  this.answerSelection = answerSelection;
  this.correctAnswer = correctAnswer;
}

Question.prototype.checkTheAnswer = function (answer) {
  return answer === this.correctAnswer;
};

function Quiz(questions) {
  this.questionIndex = 0;
  this.questions = questions;
  this.theNumberOfCorrerctAnswers = 0;
  this.userAnswers = [];
}

Quiz.prototype.getQuestion = function () {
  return this.questions[this.questionIndex];
};

function UI() {
  this.quiz_box = document.querySelector("#quiz-box");
  this.buttonBox = document.querySelector("#button-box");
  this.scoreBox = document.querySelector("#score-box");
  this.trophyIcon = document.querySelector(".trophy-icon");

  this.appContainer = document.querySelector(".app-container");
  this.body = document.querySelector("#quiz-box #body");
  this.footer = document.querySelector("#footer");
  this.progress = document.querySelector(".question-index");

  this.correctIcon = ` <i class="bi bi-check-circle"></i>`;
  this.inCorrectIcon = `<i class="bi bi-x-circle"></i>`;
  this.btnStart = document.querySelector(".btn-start");

  this.btnReplay = document.querySelector(".btn-replay");
  this.btnQuit = document.querySelector(".btn-quit");
  this.timeBox = document.querySelector(".time");
  this.timeText = document.querySelector(".time-text");
  this.timeSecond = document.querySelector(".time-second");
  this.timeLine = document.querySelector(".time-line");
}

UI.prototype.showQuestion = function (question) {
  this.body.innerHTML = "";
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  const title = document.createElement("h5");
  title.classList.add("question-title");
  title.textContent = question.questText;

  const optionList = document.createElement("div");
  optionList.classList.add("option-list");

  for (let [key, value] of Object.entries(question.answerSelection)) {
    const option = document.createElement("div");
    option.classList.add("option");
    option.addEventListener("click", optionSelected);
    const span = document.createElement("span");
    span.textContent = key + ") " + value;

    option.appendChild(span);
    optionList.appendChild(option);
  }

  cardBody.appendChild(title);
  cardBody.appendChild(optionList);

  this.body.appendChild(cardBody);
};

UI.prototype.disableAllOption = function () {
  const options = document.querySelectorAll(".option");
  for (let option of options) {
    option.classList.add("disabled");
  }
};

UI.prototype.updateProgress = function (current, total) {
  this.progress.textContent = current + "/" + total;
};

UI.prototype.showCompleted = function (quiz) {
  this.body.innerHTML = "";
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body", "text-center");

  const title = document.createElement("h5");
  title.textContent = "Quiz completed!";
  cardBody.appendChild(title);

  const reviewToggle = document.createElement("button");
  reviewToggle.type = "button";
  reviewToggle.classList.add("btn", "btn-outline-secondary", "btn-sm", "review-toggle");
  reviewToggle.setAttribute("data-bs-toggle", "collapse");
  reviewToggle.setAttribute("data-bs-target", "#reviewListCollapse");
  reviewToggle.textContent = "Show Answers";
  cardBody.appendChild(reviewToggle);

  const reviewListCollapse = document.createElement("div");
  reviewListCollapse.classList.add("collapse");
  reviewListCollapse.id = "reviewListCollapse";
  reviewListCollapse.addEventListener("show.bs.collapse", () => {
    this.appContainer.classList.add("shifted");
    reviewToggle.textContent = "Hide Answers";
  });
  reviewListCollapse.addEventListener("hide.bs.collapse", () => {
    this.appContainer.classList.remove("shifted");
    reviewToggle.textContent = "Show Answers";
  });

  const reviewList = document.createElement("div");
  reviewList.classList.add("review-list", "accordion", "text-start");
  reviewList.id = "reviewAccordion";

  quiz.questions.forEach((question, index) => {
    const userAnswer = quiz.userAnswers[index];
    const isCorrect = Boolean(userAnswer && userAnswer.isCorrect);

    const reviewItem = document.createElement("div");
    reviewItem.classList.add(
      "review-item",
      "accordion-item",
      isCorrect ? "correct" : "incorrect",
    );

    const header = document.createElement("h2");
    header.classList.add("accordion-header");

    const questionButton = document.createElement("button");
    questionButton.type = "button";
    questionButton.classList.add(
      "accordion-button",
      "collapsed",
      "review-question",
    );
    questionButton.setAttribute("data-bs-toggle", "collapse");
    questionButton.setAttribute("data-bs-target", `#reviewCollapse${index}`);
    questionButton.innerHTML = `${isCorrect ? this.correctIcon : this.inCorrectIcon} ${question.questText}`;
    header.appendChild(questionButton);

    const collapseBox = document.createElement("div");
    collapseBox.id = `reviewCollapse${index}`;
    collapseBox.classList.add("accordion-collapse", "collapse");

    const collapseBody = document.createElement("div");
    collapseBody.classList.add("accordion-body");

    const yourAnswerText = document.createElement("p");
    yourAnswerText.classList.add("review-answer");
    const yourAnswer = userAnswer
      ? `${userAnswer.selected}) ${question.answerSelection[userAnswer.selected]}`
      : "No answer";
    yourAnswerText.innerHTML = `Your answer: <strong>${yourAnswer}</strong>`;
    collapseBody.appendChild(yourAnswerText);

    if (!isCorrect) {
      const correctAnswerText = document.createElement("p");
      correctAnswerText.classList.add("review-correct-answer");
      correctAnswerText.innerHTML = `Correct answer: <strong>${question.correctAnswer}) ${question.answerSelection[question.correctAnswer]}</strong>`;
      collapseBody.appendChild(correctAnswerText);
    }

    collapseBox.appendChild(collapseBody);
    reviewItem.appendChild(header);
    reviewItem.appendChild(collapseBox);
    reviewList.appendChild(reviewItem);
  });

  reviewListCollapse.appendChild(reviewList);
  cardBody.appendChild(reviewListCollapse);
  this.body.appendChild(cardBody);
};

const questionList = [
  new Question(
    "1. Which language runs in a web browser?",
    { a: "Java", b: "C", c: "Python", d: "JavaScript" },
    "d",
  ),
  new Question(
    "2. What does CSS stand for?",
    {
      a: "Cascading Style Sheets",
      b: "Computer Style Sheets",
      c: "Creative Style Sheets",
      d: "Colorful Style Sheets",
    },
    "a",
  ),
  new Question(
    "3. What does HTML stand for?",
    {
      a: "Hyperlinks and Text Markup Language",
      b: "Home Tool Markup Language",
      c: "Hyper Text Markup Language",
      d: "Hyper Text Making Language",
    },
    "c",
  ),
  new Question(
    "4. Which array method adds an element to the end?",
    { a: "push()", b: "pop()", c: "shift()", d: "unshift()" },
    "a",
  ),
  new Question(
    "5. Which keyword declares a block-scoped variable in JavaScript?",
    { a: "var", b: "let", c: "def", d: "static" },
    "b",
  ),
  new Question(
    "6. Which HTML tag is used to link an external CSS file?",
    { a: "<style>", b: "<script>", c: "<link>", d: "<css>" },
    "c",
  ),
  new Question(
    "7. Which CSS property changes the text color of an element?",
    { a: "font-color", b: "text-color", c: "color", d: "background-color" },
    "c",
  ),
  new Question(
    "8. What does DOM stand for?",
    {
      a: "Document Object Model",
      b: "Data Object Model",
      c: "Document Order Model",
      d: "Digital Object Model",
    },
    "a",
  ),
  new Question(
    "9. Which JSON method converts a JavaScript object into a string?",
    {
      a: "JSON.parse()",
      b: "JSON.stringify()",
      c: "JSON.toText()",
      d: "JSON.object()",
    },
    "b",
  ),
  new Question(
    "10. Which operator checks both value and type equality in JavaScript?",
    { a: "==", b: "=", c: "===", d: "!=" },
    "c",
  ),
];

const quiz = new Quiz(questionList);
const ui = new UI();

ui.showQuestion(quiz.getQuestion());
ui.updateProgress(quiz.questionIndex + 1, quiz.questions.length);

document.getElementById("btn-next").addEventListener("click", function () {
  quiz.questionIndex++;

  if (quiz.questionIndex < quiz.questions.length) {
    startTimer(10);
    startTimerLine();
    ui.showQuestion(quiz.getQuestion());
    ui.updateProgress(quiz.questionIndex + 1, quiz.questions.length);
  } else {
    clearInterval(counter);
    clearInterval(counterLine);
    ui.timeBox.style.display = "none";
    ui.timeLine.style.width = "0";
    ui.footer.style.display = "none";
    ui.showCompleted(quiz);
    ui.showScore(quiz.theNumberOfCorrerctAnswers, quiz.questions.length);
    ui.scoreBox.classList.add("active");
  }
});

function optionSelected(e) {
  clearInterval(counter);
  clearInterval(counterLine);
  const option = e.currentTarget;
  const answer = option.textContent[0];
  const question = quiz.getQuestion();
  const isCorrect = question.checkTheAnswer(answer);

  quiz.userAnswers[quiz.questionIndex] = { selected: answer, isCorrect };

  if (isCorrect) {
    quiz.theNumberOfCorrerctAnswers++;
    option.classList.add("correct");
    option.insertAdjacentHTML("beforeend", ui.correctIcon);
  } else {
    option.classList.add("incorrect");
    option.insertAdjacentHTML("beforeend", ui.inCorrectIcon);
  }

  ui.disableAllOption();
}

UI.prototype.showScore = function (theNumberOfCorrectAnswer, totalQuestions) {
  const tag = `You gave ${theNumberOfCorrectAnswer} correct answers out of a total of ${totalQuestions} questions.`;
  document.querySelector(".score-text").innerHTML = tag;

  const percentage = (theNumberOfCorrectAnswer / totalQuestions) * 100;
  this.trophyIcon.classList.remove(
    "text-primary",
    "trophy-bronze",
    "trophy-silver",
    "trophy-gold",
  );

  if (percentage >= 90) {
    this.trophyIcon.style.display = "";
    this.trophyIcon.classList.add("trophy-gold");
  } else if (percentage >= 70) {
    this.trophyIcon.style.display = "";
    this.trophyIcon.classList.add("trophy-silver");
  } else if (percentage >= 50) {
    this.trophyIcon.style.display = "";
    this.trophyIcon.classList.add("trophy-bronze");
  } else {
    this.trophyIcon.style.display = "none";
  }
};

ui.btnQuit.addEventListener("click", function () {
  window.location.reload();
});
ui.btnReplay.addEventListener("click", function () {
  quiz.questionIndex = 0;
  quiz.theNumberOfCorrerctAnswers = 0;
  quiz.userAnswers = [];
  ui.scoreBox.classList.remove("active");
  ui.footer.style.display = "";
  startTimer(10);
  startTimerLine();
  ui.showQuestion(quiz.getQuestion());
  ui.updateProgress(quiz.questionIndex + 1, quiz.questions.length);
});

ui.btnStart.addEventListener("click", function () {
  ui.quiz_box.classList.add("active");
  ui.buttonBox.classList.remove("active");
  startTimer(10);
  startTimerLine();
  ui.showQuestion(quiz.getQuestion());
  ui.updateProgress(quiz.questionIndex + 1, quiz.questions.length);
});

function startTimer(time) {
  clearInterval(counter);
  ui.timeBox.style.display = "flex";
  counter = setInterval(timer, 1000);

  function timer() {
    ui.timeSecond.textContent = time;
    // console.log(time);
    time--;

    if (time < 0) {
      clearInterval(counter);
      ui.timeBox.style.display = "none";
      ui.disableAllOption();
      quiz.questionIndex++;
    }
  }
}

function startTimerLine() {
  clearInterval(counterLine);
  let line_width = ui.quiz_box.offsetWidth;
  ui.timeLine.style.width = line_width + "px";
  counterLine = setInterval(timer, 20);

  function timer() {
    line_width--;
    ui.timeLine.style.width = line_width + "px";
    if (line_width <= 0) {
      clearInterval(counterLine);
    }
  }
}
