// this event listener makes sure all the HTML file is read before this javascript file
document.addEventListener("DOMContentLoaded", () => {
  // this is the grid
  const grid = document.querySelector(".grid");
  const width = 8;
  const squares = [];
  const scoreDisplay = document.getElementById('score')
  let score = 0;
  const squareColors = ["red", "yellow", "purple", "green", "blue", "orange"];

  //this function creates the squares on the board
  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("draggable", true);
      square.setAttribute("id", i);
      let randomColor = Math.floor(Math.random() * squareColors.length);
      square.style.backgroundColor = squareColors[randomColor]; //
      grid.appendChild(square);
      squares.push(square);
    }
  }
  createBoard();

  // Drag

  let squareBeingDragged;
  let squareBeingReplaced;
  let squareIdBeingDragged;
  let squareIdBeingReplaced;

  squares.forEach((square) => square.addEventListener("dragstart", dragStart));
  squares.forEach((square) => square.addEventListener("dragend", dragEnd));
  squares.forEach((square) => square.addEventListener("dragover", dragOver));
  squares.forEach((square) => square.addEventListener("dragenter", dragEnter));
  squares.forEach((square) => square.addEventListener("dragleave", dragLeave));
  squares.forEach((square) => square.addEventListener("drop", dragDrop));

  function dragStart() {
    squareBeingDragged = this.style.backgroundColor;
    console.log(this.id, "dragstart");
    squareIdBeingDragged = parseInt(this.id); // converts square id into a number
    console.log(squareBeingDragged);
  }
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
    console.log(this.id, "dragDrop");
    squareBeingReplaced = this.style.backgroundColor;
    squareIdBeingReplaced = parseInt(this.id); //convers square being replaced Id to a number so it can be used to calculate Id of valid moves below (because you need to add/subtract)
    this.style.backgroundColor = squareBeingDragged;
    squares[squareIdBeingDragged].style.backgroundColor = squareBeingReplaced; // this will give the new square the color of the square being replaced
  }
  function dragEnd() {
    console.log(this.id, "dragend");
    let validMoves = [
      squareIdBeingDragged - 1, // square to left
      squareIdBeingDragged - width, //square above dragged square on grid (one full width back in array)
      squareIdBeingDragged + 1, //square to square to right
      squareIdBeingDragged + width, //square below dragged square on grid (one full width forward in array)
    ];
    let validMove = validMoves.includes(squareIdBeingReplaced);

    if (squareIdBeingReplaced && validMove) {
      squareIdBeingReplaced = null;
    } else if (squareIdBeingReplaced && !validMove) {
      squares[squareIdBeingReplaced].style.backgroundColor =
        squareBeingReplaced; // if it is not a valid move square color does not change
      squares[squareIdBeingDragged].style.backgroundColor = squareBeingDragged;
    } else
      squares[squareIdBeingDragged].style.backgroundColor = squareBeingDragged; // color doesn't change until after dragEnd has finished
  }
  /* currently squares can be swapped if one begins a row and the other ends a row which needs fixing. 
  Also can swap squares diagonally which needs fixing */

  // Check for matching squares - row of three

  // drop sqaures down after clearing

  /*function fillBlanksAtStart () {
    for (i = 0; i < squares.length; i++) {
    let randomColor = Math.floor(Math.random() * squareColors.length)
    if (squares[i].style.backgroundColor === '') {
      squares[i].style.backgroundColor = squareColors[randomColor]
    }
  }
  }*/

  function moveDown() {
    for (i = 0; i <= 55; i++) {
        if (squares[i + width].style.backgroundColor === '') {
            squares[i + width].style.backgroundColor = squares[i].style.backgroundColor
            squares[i].style.backgroundColor = ''
            const firstRow = [0, 1, 2, 3, 4, 5, 6, 7]
            const isFirstRow = firstRow.includes(i)
            if (isFirstRow && (squares[i].style.backgroundColor === '')) {
              let randomColor = Math.floor(Math.random() * squareColors.length)
              squares[i].style.backgroundColor = squareColors[randomColor]
            }
        }
    }
  }



  function checkRow() {
    for (i = 0; i < 63; i++) {
      //for has to be set at 61 because that's the maximum that can be checked ie square 61, 62 and 63

      let rowOfThree = [i, i + 1, i + 2]; //three squares inside square array
      let decidedColor = squares[i].style.backgroundColor;
      const isBlank = squares[i].style.backgroundColor === "";

      const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55]; // array of square ID's that are the last two on each row

      if (notValid.includes(i)) continue; // if the square id being dragged/replaced is included in the array of invalid squares skip it

      if (
        rowOfThree.every(
          (index) =>
            squares[index].style.backgroundColor === decidedColor && !isBlank
        )
      ) {
        score += 100;
        scoreDisplay.innerHTML = score
        rowOfThree.forEach((index) => {
          squares[index].style.backgroundColor = "";
        });
      }
    }
  }
  checkRow();


  function checkColumn() {
    for (i = 0; i <= 48; i++) {
      //for has to be set at 47 because that's the maximum that can be checked ie square 47, 55, 63. 63 is last viable square because first square index is 0

      let columnOfThree = [i, i + width, i + width * 2]; //three squares inside square array - square ID plus width to go up one row and plus double width to go up two rows
      let decidedColor = squares[i].style.backgroundColor;
      const isBlank = squares[i].style.backgroundColor === "";

      if (
        columnOfThree.every(
          (index) =>
            squares[index].style.backgroundColor === decidedColor && !isBlank
        )
      ) {
        score += 100;
        scoreDisplay.innerHTML = score
        columnOfThree.forEach((index) => {
          squares[index].style.backgroundColor = "";
        });
      }
    }
  }
  checkColumn();

  function checkFourSquare() {
    for (i = 0; i <= 48; i++) {

      let fourSquare = [i, i + 1, i + width, i + width + 1]; //three squares inside square array - square ID plus width to go up one row and plus double width to go up two rows
      let decidedColor = squares[i].style.backgroundColor;
      const isBlank = squares[i].style.backgroundColor === "";

      if (
        fourSquare.every(
          (index) =>
            squares[index].style.backgroundColor === decidedColor && !isBlank
        )
      ) {
        score += 500;
        scoreDisplay.innerHTML = score
        fourSquare.forEach((index) => {
          squares[index].style.backgroundColor = "";
        });
      }
    }
  }
  checkFourSquare()

  window.setInterval(function () {
    //fillBlanksAtStart()
    moveDown(); // this needs to execute first
    checkRow();
    checkColumn(); 
    moveDown()
    checkFourSquare()
    
    
    moveDown()

  }, 100);


})
  // need to add start and pause buttons // global event listener everything inside this
