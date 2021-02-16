//gameboard module
const boardModule = (function() {
  let _boardArr = new Array("", "", "", "", "", "", "", "", "");
  
  function setBoard(mark, index) {
    if (_boardArr[index] === "") {
      _boardArr[index] = mark;
    }
  }

  function getBoard() {
    return _boardArr;
  }

  function getRows() {
    let rows = [];
    let indexes = [0, 1, 2];
    for (let i = 0; i < indexes.length; i++) {
      let row = [];
      for (let k = 0; k < indexes.length; k++) {
        let index = indexes[k];
        row.push(_boardArr[index]);
        indexes[k] += 3;
      }
      rows.push(row);
    }
    return rows;
  }

  function getColumns() {
    let columns = [];
    let indexes = [0, 3, 6];
    for (let i = 0; i < indexes.length; i++) {
      let column = [];
      for (let k = 0; k < indexes.length; k++) {
        let index = indexes[k];
        column.push(_boardArr[index]);
        indexes[k]++;
      }
      columns.push(column);
    }
    return columns;
  }

  function getDiagonals() {
    let diagonalA = [_boardArr[0], _boardArr[4], _boardArr[8]];
    let diagonalB = [_boardArr[2], _boardArr[4], _boardArr[6]];
    let diagonals = [diagonalA, diagonalB];
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
    _fieldNodes[i].addEventListener(("click"), (e) => {
      if (e.target.textContent === "") {
        _count % 2 === 0 ? Player1.pushMarkToBoard(i) : Player2.pushMarkToBoard(i);
        renderFunction();
        _count++;
      }
    })
  }
  //END OF DISPLAY FUNCTIONALITY

  return {
    renderFunction
  }
})();

const Player1 = Player(1, "SM");
const Player2 = Player(2, "SMD");