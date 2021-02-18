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

  function _getRows() {
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

  function _getColumns() {
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

  function _getDiagonals() {
    let diagonalA = [_boardArr[0], _boardArr[4], _boardArr[8]];
    let diagonalB = [_boardArr[2], _boardArr[4], _boardArr[6]];
    let diagonals = [diagonalA, diagonalB];
    return diagonals;
  }
  
  function _getAll() {
    let rows = _getRows();
    let columns = _getColumns();
    let diagonals = _getDiagonals();
    let all = [rows, columns, diagonals];
    return all;
  }

  //check if game is over (=win X or win O or tie)
  function getGameStatus() {
    let winX = "xxx";
    let winO = "ooo";
    let status;
    let board = _getAll();
    let boardStringified = [];
    board.forEach((arr) => {
      arr.forEach((subArr) => {
        boardStringified.push(subArr.join(""));
      })
    })
    let checkWinX = boardStringified.some((arr) => arr === winX);
    let checkWinO = boardStringified.some((arr) => arr === winO);
  
    if (checkWinX === true) {
      status = "x";
    } else if (checkWinO === true) {
      status = "o";
    } else {
      let checkTie = _boardArr.includes("");
       checkTie === false ? status = "tie" : status = "not over";
    }
  
    return status;
  }

  return {
    setBoard,
    getBoard,
    getGameStatus
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

//gameflow module
const gameFlow = (function() {
  let boardArr = boardModule.getBoard();
  //DISPLAY FUNCTIONALITY
  //DOM render status to page
  function _renderStatus(index) {
    let statusDiv = document.querySelector("#status");
    let status = boardModule.getGameStatus();
    switch (status) {
      case "x": 
        statusDiv.textContent = "X wins!";
        break;
      case "o": 
        statusDiv.textContent = "O wins!";
        break;
      case "tie":
        statusDiv.textContent = "It's a tie!";
        break;
      case "not over":
        let boardArr = boardModule.getBoard();
        let mark = boardArr[index];
        mark === "x" ? statusDiv.textContent = "It's O's turn!" : statusDiv.textContent = "It's X's turn!";
        break;
    }
  }

  //DOM render board content to page
  function _renderBoard(index) {
    let selector = "#f" + index;
    let boardField = document.querySelector(selector);
    boardField.firstElementChild.classList.add("fadeMark");
    boardField.firstElementChild.textContent = boardArr[index];
  }

  //DOM click event for gameboard fields
  let _count = 0;
  const _fieldNodes = document.querySelectorAll(".field");
  for (let i = 0; i < _fieldNodes.length; i++) {
    _fieldNodes[i].addEventListener(("click"), (e) => {
      let status = boardModule.getGameStatus();
      if (e.target.textContent === "" && status === "not over") {
        _count % 2 === 0 ? Player1.pushMarkToBoard(i) : Player2.pushMarkToBoard(i);
        _renderBoard(i);
        _count++;
      }
      _renderStatus(i);
    })
  }
  //END OF DISPLAY FUNCTIONALITY
})();

const Player1 = Player(1, "SM");
const Player2 = Player(2, "SMD");