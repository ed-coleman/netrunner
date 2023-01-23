// this event listener makes sure all the HTML file is read before this javascript file
document.addEventListener('DOMContentLoaded', () => {
    
  // this is the grid
  const grid = document.querySelector('.grid');
  const width = 8;
  const squares = [];

  const squareColors = [
    'red',
    'yellow',
    'purple',
    'green',
    'blue'
  ]

  //this function creates the squares on the board
  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement('div');
      square.setAttribute('draggable', true)
      square.setAttribute('id', i)
      let randomColor = Math.floor(Math.random() * squareColors.length)
      square.style.backgroundColor = squareColors[randomColor] //
      grid.appendChild(square);
      squares.push(square);
    }
  }
  createBoard();

// Drag

squares.forEach(square => square.addEventListener('dragstart', dragStart))
squares.forEach(square => square.addEventListener('dragend', dragEnd))
squares.forEach(square => square.addEventListener('dragover', dragOver))
squares.forEach(square => square.addEventListener('dragenter', dragEnter))
squares.forEach(square => square.addEventListener('dragleave', dragLeave))
squares.forEach(square => square.addEventListener('drop', dragDrop))


function dragStart() {
    console.log(this.id, 'dragstart')
}
function dragOver() {
    console.log(this.id, 'dragover')
}
function dragEnter() {
    console.log(this.id, 'dragenter')
}
function dragLeave() {
    console.log(this.id, 'dragleave')
}
function dragEnd () {
    console.log(this.id, 'dragend')
}
function dragDrop() {
    console.log(this.id, 'dragDrop')
}


});
