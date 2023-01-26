// this event listener makes sure all the HTML file is read before this javascript file
document.addEventListener("DOMContentLoaded", () => {
  // this is the grid
  const grid = document.querySelector(".grid");
  let scoreBoard = document.querySelector(".container");
  const terminationMessage = document.querySelector(".secret-menu");
  const width = 8;
  const squares = [];
  const scoreDisplay = document.getElementById("score");
  const timerDisplay = document.getElementById("timer");
  const movesDisplay = document.getElementById("moves");
  const endScoreDisplay = document.getElementById("endScore");

  let score = 0;
  let moves = 10;
  let timer;

  const squareColors = [
    "url(blue1.png)",
    "url(blue2.png)",
    "url(blue3.png)",
    "url(blue4.png)",
    "url(blue5.png)",
    "url(blue6.png)",
    "url(blue7.png)",
    "url(blue8.png)",
    "url(icon1.png)",
  ];

  const startButton = document.getElementById("startButton");
  console.log(startButton);

  const restartButton = document.getElementById("restartButton");
  console.log(restartButton);

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
    console.log("start button clicked");
    resetScore();
    startTime();
    grid.style.display = "flex";
    scoreBoard.style.display = "flex";
    startButton.style.display = "none";
    restartButton.style.display = "flex";
    terminationMessage.style.display = "none";
    tryAgainButton.style.display = "none";
  }

  function restartGame() {
    location.reload();
    tryAgainButton.style.display = "none";
  }

  function gameOver() {
    console.log("GAME OVER");
    grid.style.display = "none";
    scoreBoard.style.display = "none";
    startButton.style.display = "none";
    restartButton.style.display = "none";
    tryAgainButton.style.display = "flex";
    terminationMessage.style.display = "flex";
  }

  //this function creates the squares on the board
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
    console.log(timer);
  }

  // Drag

  let squareBeingDragged;
  let squareBeingReplaced;
  let squareIdBeingDragged;
  let squareIdBeingReplaced;

  squares.forEach((square) =>
    square.addEventListener("dragstart", (e) => {
      /*console.log(e.target.style.backgroundImage.url, squareColors[8])
     if (e.target.style.backgroundImage === squareColors[8]) {
      e.target.setAttribute("draggable", false)
      console.log(square)
    }*/
      console.log(square);
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
    console.log("dragstart Start");
    squareIdBeingDragged = parseInt(something.id); // converts square id into a number
    console.log(squareBeingDragged);
    console.log("dragStart End");
  }

  /*const ice = "url(icon1.png)"
ice.ondragstart = () => {
  return false;
};*/

  function dragOver(e) {
    e.preventDefault();
    console.log(this.id, "dragover");
  }
  function dragEnter(e) {
    e.preventDefault();
    console.log(this.id, "dragenter");
  }
  function dragLeave() {
    console.log(this.id, "dragleave");
  }

  function dragDrop() {
    console.log("dragDrop start");
    squareBeingReplaced = this.style.backgroundImage;
    console.log(
      `squareBeingReplaced this.style.backgroundImage = ${this.style.backgroundImage}`
    );
    if (squareBeingReplaced === squareColors[8]) {
      console.log(`${squareColors[8]} is the same are the url`);
    }
    squareIdBeingReplaced = parseInt(this.id); //convers square being replaced Id to a number so it can be used to calculate Id of valid moves below (because you need to add/subtract)
    console.log(`squareBeingReplaced = ${squareBeingReplaced}`);
    console.log(`squareIdBeingReplaced = ${squareIdBeingReplaced}`);
    this.style.backgroundImage = squareBeingDragged;
    squares[squareIdBeingDragged].style.backgroundImage = squareBeingReplaced;
    console.log(`squareIdBeingDragged = ${squareIdBeingDragged}`); // this will give the new square the color of the square being replaced
    console.log("dragDrop end");
  }

  function dragEnd() {
    console.log("dragEnd start");
    let validMoves = [
      squareIdBeingDragged - 1, // square to left
      squareIdBeingDragged - width, //square above dragged square on grid (one full width back in array)
      squareIdBeingDragged + 1, //square to square to right
      squareIdBeingDragged + width, //square below dragged square on grid (one full width forward in array)
    ];
    console.log(`squareBeingDragged = ${squareBeingDragged}`); // square beingDragged is an IMG

    let validMove = validMoves.includes(squareIdBeingReplaced);

    if (squareIdBeingReplaced && validMove) {
      squareIdBeingReplaced = null;
      moves--;
      movesDisplay.innerHTML = moves;
    } else if (squareIdBeingReplaced && !validMove) {
      squares[squareIdBeingReplaced].style.backgroundImage =
        squareBeingReplaced; // if it is not a valid move square color does not change
      console.log(`squareBeingReplaced = ${squareBeingReplaced}`);
      squares[squareIdBeingDragged].style.backgroundImage = squareBeingDragged;
    } else {
      squares[squareIdBeingDragged].style.backgroundImage = squareBeingDragged; // color doesn't change until after dragEnd has finished
      //console.log(squares[squareBeingReplaced].style.backgroundImage)
    }
    console.log("dragEnd End");
  }
  /* currently squares can be swapped if one begins a row and the other ends a row which needs fixing. 
  Also can swap squares diagonally which needs fixing */

  // Check for matching squares - row of three

  // drop sqaures down after clearing

  /*function fillBlanksAtStart () {
    for (i = 0; i < squares.length; i++) {
    let randomColor = Math.floor(Math.random() * squareColors.length)
    if (squares[i].style.backgroundImage === '') {
      squares[i].style.backgroundImage = squareColors[randomColor]
    }
  }
  }*/

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
      //for has to be set at 61 because that's the maximum that can be checked ie square 61, 62 and 63

      let rowOfThree = [i, i + 1, i + 2]; //three squares inside square array
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55]; // array of square ID's that are the last two on each row
      if (notValid.includes(i)) continue;

      if (
        rowOfThree.every(
          (index) =>
            squares[index].style.backgroundImage === decidedColor && !isBlank
        )
      ) {
        score += 10;
        console.log(`score = ${score}`);
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
      //for has to be set at 47 because that's the maximum that can be checked ie square 47, 55, 63. 63 is last viable square because first square index is 0

      let columnOfThree = [i, i + width, i + width * 2]; //three squares inside square array - square ID plus width to go up one row and plus double width to go up two rows
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      if (
        columnOfThree.every(
          (index) =>
            squares[index].style.backgroundImage === decidedColor && !isBlank
        )
      ) {
        score += 10;
        console.log(`score = ${score}`);
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
      let fourSquare = [i, i + 1, i + width, i + width + 1]; //three squares inside square array - square ID plus width to go up one row and plus double width to go up two rows
      let decidedColor = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === "";

      if (
        fourSquare.every(
          (index) =>
            squares[index].style.backgroundImage === decidedColor && !isBlank
        )
      ) {
        score += 20;
        console.log(`score = ${score}`);
        timer += 4;
        moves += 4;
        movesDisplay.innerHTML = moves;
        scoreDisplay.innerHTML = score;
        fourSquare.forEach((index) => {
          squares[index].style.backgroundImage = "";
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
    console.log("made ice");
  }

  const iceInterval = setInterval(makeIce, 5000);

  window.setInterval(function () {
    //fillBlanksAtStart()
    moveDown(); // this needs to execute first
    checkRow();
    checkColumn();
    checkFourSquare();
    checkGameOver();
    
  }, 100);
});
// need to add start and pause buttons // global event listener everything inside this
