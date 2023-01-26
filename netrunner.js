// this event listener makes sure all the HTML file is read before this javascript file
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let scoreBoard = document.querySelector(".container");
  const terminationMessage = document.querySelector(".secret-menu");
  const width = 8;
  const squares = [];
  const scoreDisplay = document.getElementById("score");
  const timerDisplay = document.getElementById("timer");
  const movesDisplay = document.getElementById("moves");
  const endScoreDisplay = document.getElementById("endScore");
  const audio = new Audio("music/WBA Free Track - Midnight.mp3");

  const tileMoveSOund = new Audio("music/interface-124464.mp3");
  const buttonPress = new Audio("music/buttonpress-94482.mp3");
  const tryAgainButtonPress = new Audio("music/interface-124464.mp3");
  const exitButtonPress = new Audio("music/invalid-selection-39351.mp3");

  let score = 0;
  let moves = 10;
  let timer;

  window.setInterval(function () {
    moveDown();
    checkGameOver();
    checkRow();
    checkColumn();
    checkFourSquare();
  }, 100);

  const squareColors = [
    "url(images/blue1.png)",
    "url(images/blue2.png)",
    "url(images/blue3.png)",
    "url(images/blue4.png)",
    "url(images/blue5.png)",
    "url(images/blue6.png)",
    "url(images/blue7.png)",
    "url(images/blue8.png)",
    "url(images/icon1.png)",
  ];

  const startButton = document.getElementById("startButton");
  const restartButton = document.getElementById("restartButton");
  const tryAgainButton = document.getElementById("tryAgain");

  restartButton.style.display = "none";

  startButton.addEventListener("click", startGame);
  restartButton.addEventListener("click", gameOver);
  tryAgainButton.addEventListener("click", restartGame);

  function resetScore() {
    score = 0;
    moves = 10;
    timer = 21;
  }

  function startGame() {
    buttonPress.play();
    resetScore();
    startTime();
    grid.style.display = "flex";
    scoreBoard.style.display = "flex";
    startButton.style.display = "none";
    restartButton.style.display = "flex";
    terminationMessage.style.display = "none";
    tryAgainButton.style.display = "none";
    audio.volume = 0.6;
    audio.play();
  }

  function restartGame() {
    tryAgainButtonPress.play();
    location.reload();
    tryAgainButton.style.display = "none";
  }

  function gameOver() {
    exitButtonPress.play();
    grid.style.display = "none";
    scoreBoard.style.display = "none";
    startButton.style.display = "none";
    restartButton.style.display = "none";
    tryAgainButton.style.display = "flex";
    terminationMessage.style.display = "flex";
    audio.volume = 0.3;
  }

  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("draggable", true);
      square.setAttribute("id", i);
      let randomColor = Math.floor(Math.random() * squareColors.length - 1);
      square.style.backgroundImage = squareColors[randomColor]; //
      grid.appendChild(square);
      squares.push(square);
    }
  }
  createBoard();

  setInterval(startTime, 1000);

  function startTime() {
    timer--;
    timerDisplay.innerHTML = timer;
  }

  let squareBeingDragged;
  let squareBeingReplaced;
  let squareIdBeingDragged;
  let squareIdBeingReplaced;

  squares.forEach((square) =>
    square.addEventListener("dragstart", (e) => {
      if (e.target.draggable === true) {
        dragStart(e.target);
      }
    })
  );
  squares.forEach((square) =>
    square.addEventListener("dragend", (e) => {
      if (e.target.draggable === true) {
        dragEnd(e.target);
      }
    })
  );

  squares.forEach((square) => square.addEventListener("dragover", dragOver));
  squares.forEach((square) => square.addEventListener("dragenter", dragEnter));
  squares.forEach((square) => square.addEventListener("dragleave", dragLeave));
  squares.forEach((square) => square.addEventListener("drop", dragDrop));

  function dragStart(something) {
    squareBeingDragged = something.style.backgroundImage;

    squareIdBeingDragged = parseInt(something.id);
  }

  function dragOver(e) {
    e.preventDefault();
  }
  function dragEnter(e) {
    e.preventDefault();
  }
  function dragLeave() {}

  function dragDrop() {
    squareBeingReplaced = this.style.backgroundImage;

    if (squareBeingReplaced === squareColors[8]) {
      console.log(`${squareColors[8]} is the same are the url`);
    }
    squareIdBeingReplaced = parseInt(this.id);

    this.style.backgroundImage = squareBeingDragged;
    squares[squareIdBeingDragged].style.backgroundImage = squareBeingReplaced;
  }

  function dragEnd() {
    let validMoves = [
      squareIdBeingDragged - 1,
      squareIdBeingDragged - width,
      squareIdBeingDragged + 1,
      squareIdBeingDragged + width,
    ];

    let validMove = validMoves.includes(squareIdBeingReplaced);

    if (squareIdBeingReplaced && validMove) {
      squareIdBeingReplaced = null;
      moves--;
      movesDisplay.innerHTML = moves;
    } else if (squareIdBeingReplaced && !validMove) {
      squares[squareIdBeingReplaced].style.backgroundImage =
        squareBeingReplaced;
      squares[squareIdBeingDragged].style.backgroundImage = squareBeingDragged;
    } else {
      squares[squareIdBeingDragged].style.backgroundImage = squareBeingDragged;
    }
  }

  scoreDisplay.innerHTML = moves;
  movesDisplay.innerHTML = score;

  function moveDown() {
    for (i = 0; i <= 55; i++) {
      if (squares[i + width].style.backgroundImage === "") {
        squares[i + width].style.backgroundImage =
          squares[i].style.backgroundImage;
        squares[i].style.backgroundImage = "";
        const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
        const isFirstRow = firstRow.includes(i);
        if (isFirstRow && squares[i].style.backgroundImage === "") {
          let randomColor = Math.floor(Math.random() * squareColors.length - 1);
          squares[i].style.backgroundImage = squareColors[randomColor];
        }
      }
    }
  }

  function checkRow() {
    for (i = 0; i < 63; i++) {
      let rowOfThree = [i, i + 1, i + 2];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
      if (notValid.includes(i)) continue;

      if (
        rowOfThree.every(
          (index) =>
            squares[index].style.backgroundImage === decidedColor && !isBlank
        )
      ) {
        score += 10;
        tileMoveSOund.play();
        timer += 3;
        moves += 1;
        movesDisplay.innerHTML = moves;
        scoreDisplay.innerHTML = score;
        rowOfThree.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
      }
    }
  }

  function checkColumn() {
    for (i = 0; i <= 48; i++) {
      let columnOfThree = [i, i + width, i + width * 2];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      if (
        columnOfThree.every(
          (index) =>
            squares[index].style.backgroundImage === decidedColor && !isBlank
        )
      ) {
        score += 10;
        tileMoveSOund.play();
        timer += 3;
        moves += 1;
        scoreDisplay.innerHTML = score;
        movesDisplay.innerHTML = moves;
        columnOfThree.forEach((index) => {
          squares[index].style.backgroundImage = "";
        });
      }
    }
  }

  function checkFourSquare() {
    for (i = 0; i <= 48; i++) {
      let fourSquare = [i, i + width, i + 1, i + width + 1];
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      if (
        fourSquare.every(
          (index) =>
            squares[index].style.backgroundImage === decidedColor && !isBlank
        )
      ) {
        score += 20;
        tileMoveSOund.play();

        timer += 4;
        moves += 4;
        movesDisplay.innerHTML = moves;
        scoreDisplay.innerHTML = score;
        fourSquare.forEach((index) => {
          squares[index].style.backgroundImage = '';
        });
      }
    }
  }

  function checkGameOver() {

    if (timer <= 0 || moves <= 0) {
      gameOver();
      endScoreDisplay.innerHTML = score;
    
    }
  }

  function makeIce() {
    let randomSquare = Math.floor(Math.random() * squares.length);
    squares[randomSquare].style.backgroundImage = squareColors[8];
    squares[randomSquare].setAttribute("draggable", false);
  }
  setInterval(makeIce, 8000);

  window.setInterval(function () {
    moveDown();
    checkGameOver();
    checkRow();
    checkColumn();
    checkFourSquare();
  }, 100);
});
