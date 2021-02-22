//gameboard module
const gameModule = (function() {
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

  function setPlayers(playerOneName, playerTwoName) {
    Player1 = Player(1, playerOneName);
    Player2 = Player(2, playerTwoName);
  }

  return {
    setBoard,
    getBoard,
    getGameStatus,
    setPlayers
  }
})();

//factory function for players
const Player = (slot, name) => {
  const mark = (slot === 1) ? "x" : "o";
  const pushMarkToBoard = (index) => gameModule.setBoard(mark, index);

  return {
    name,
    mark,
    pushMarkToBoard
  }
}

//interface module
const interfaceModule = (function() {
  let boardArr = gameModule.getBoard();
  //DISPLAY FUNCTIONALITY
  //DOM render status to page
  function _renderStatus(index) {
    let statusDiv = document.querySelector("#status");
    let status = gameModule.getGameStatus();
    switch (status) {
      case "x": 
        statusDiv.textContent = `${Player1.name} wins!`;
        break;
      case "o": 
        statusDiv.textContent = `${Player2.name} wins!`;
        break;
      case "tie":
        statusDiv.textContent = "It's a tie!";
        break;
      case "not over":
        let boardArr = gameModule.getBoard();
        let mark = boardArr[index];
        mark === "x" ? statusDiv.textContent = `It's ${Player2.name}'s turn!` : statusDiv.textContent = `It's ${Player1.name}'s turn!`;
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
      let status = gameModule.getGameStatus();
      if (e.target.textContent === "" && status === "not over") {
        _count % 2 === 0 ? Player1.pushMarkToBoard(i) : Player2.pushMarkToBoard(i);
        _renderBoard(i);
        _count++;
      }
      _renderStatus(i);
    })
  }

  //reload event on header text
  const title = document.querySelector("#descr");
  title.addEventListener(("click"), () => {
    location.reload();
  })

  //DOM path from welcome screen to playing the game
  const boardDiv = document.querySelector("#board");
  const startButton = document.querySelector("#startButton");
  const startGameDiv = document.querySelector("#startGame");
  const inputOne = document.createElement("input");
  const inputTwo = document.createElement("input");
  const submitButton = document.createElement("p");
  let gameType;

  //event behind the "Start Game" button
  startButton.addEventListener(("click"), () => {
    const step = document.querySelector("#step");
    step.textContent = "Choose your enemy";
    startButton.remove();

    const humanButton = document.createElement("p");
    humanButton.id = "humanButton";
    humanButton.classList.add("playerButton");
    humanButton.classList.add("button");
    humanButton.textContent = "Human";

    const botButton = document.createElement("p");
    botButton.id = "botButton";
    botButton.classList.add("playerButton");
    botButton.classList.add("button");
    botButton.textContent = "Bot";

    startGameDiv.appendChild(humanButton);
    startGameDiv.appendChild(botButton);
    addPlayerButtonsEvent();
  })

  //adds the player buttons for user choice: human or bot
  function addPlayerButtonsEvent() {
    const playerButtons = document.querySelectorAll(".playerButton");
    for (let k = 0; k < playerButtons.length; k++) {
      playerButtons[k].addEventListener(("click"), (e) => {
        e.target.id === "humanButton" ? gameType = "humanGame" : gameType = "botGame";
        step.textContent = "Please enter a name";

        const pOne = document.createElement("p");
        pOne.textContent = "Player 1:";
        startGameDiv.appendChild(pOne);
        startGameDiv.appendChild(inputOne);

        if (e.target.id === "humanButton") {
          const pTwo = document.createElement("p");
          pTwo.textContent = "Player 2:";
          startGameDiv.appendChild(pTwo);
          startGameDiv.appendChild(inputTwo);
        }

        submitButton.id = "submit";
        submitButton.classList.add("button");
        submitButton.textContent = "Submit";

        humanButton.remove();
        botButton.remove();

        startGameDiv.appendChild(submitButton);
        addSubmitButtonEvent();
      })
    }
  }

  function addSubmitButtonEvent() {
    submitButton.addEventListener(("click"), () => {
      let playerOneName = inputOne.value;
      let playerTwoName;
      gameType === "botGame" ? playerTwoName = "Bot" : playerTwoName = inputTwo.value;

      if (playerOneName === "" || playerTwoName === "") {
        alert("Please enter a name!");
      } else {
        gameModule.setPlayers(playerOneName, playerTwoName);
        startGameDiv.remove();
        boardDiv.className = "unhide";
      }
    })
  }
  //END OF DISPLAY FUNCTIONALITY
})();

let Player1;
let Player2;