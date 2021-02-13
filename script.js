//gameboard module
const boardModule = (function() {
  let _boardArr = new Array(9);
  
  function setBoard(mark, index) {
    if (_boardArr[index] === undefined) {
      _boardArr[index] = mark;
    }
  }

  function getBoard() {
    return _boardArr;
  }

  function getRows() {
    let rows = [];

    return rows;
  }

  function getColumns() {
    let columns = [];

    return columns;
  }

  function getDiagonals() {
    let diagonals = [];

    return diagonals;
  }
  
  return {
    setBoard,
    getBoard,
    getRows,
    getColumns,
    getDiagonals
  }
})();

//factory function for players
const Player = (slot, name) => {

  const mark = (slot === 1) ? "x" : "o";
  const pushMarkToBoard = (index) => boardModule.setBoard(mark, index);

  return {
    name,
    mark,
    pushMarkToBoard
  }
}

const gameFlow = (function() {
  let boardArr = boardModule.getBoard();
  //check if game is over (=win or draw)
  function checkGameStatus() {
    let board = boardArr;
    let rows = boardModule.getRows();
    let columns = boardModule.getColumns();
    let diagonals = boardModule.getDiagonals();
  }

  //DISPLAY FUNCTIONALITY
  //DOM render board content to page
  let renderFunction = function renderBoard() {
    for (let i = 0; i < boardArr.length; i++) {
      let selector = "#f" + i;
      let boardField = document.querySelector(selector);
      boardField.textContent = boardArr[i];
    }
  }
  //DOM click event for gameboard fields
  let _count = 0;
  const _fieldNodes = document.querySelectorAll(".field");
  for (let i = 0; i < _fieldNodes.length; i++) {
    _fieldNodes[i].addEventListener(("click"), () => {
      _count % 2 === 0 ? Player1.pushMarkToBoard(i) : Player2.pushMarkToBoard(i);
      renderFunction();
      _count++;
    })
  }
  //END OF DISPLAY FUNCTIONALITY

  return {
    renderFunction
  }
})();

const Player1 = Player(1, "SM");
const Player2 = Player(2, "SMD");