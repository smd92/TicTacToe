//gameboard module
const gameModule = (function () {
  let _boardArr = new Array("", "", "", "", "", "", "", "", "");

  function setBoard(mark, index) {
    if (_boardArr[index] === "") {
      _boardArr[index] = mark;
    }
  }

  function getBoard() {
    return _boardArr;
  }

  function resetBoard() {
    for (let i = 0; i < _boardArr.length; i++) {
      _boardArr[i] = "";
    }
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

  //check if game is over (= Player1 wins or Player2 wins or tie)
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

  let _Player1;
  let _Player2;

  function setPlayers(playerOneName, playerTwoName) {
    _Player1 = Player(1, playerOneName);
    _Player2 = Player(2, playerTwoName);
  }

  function getPlayers() {
    return [_Player1, _Player2];
  }

  let _count = 0;
  function playGame(gameType, difficulty, index) {
    if (gameType === "humanGame") {
      _count % 2 === 0 ? _Player1.pushMarkToBoard(index) : _Player2.pushMarkToBoard(index);
      interfaceModule.renderBoard(index);
      _count++;
    } else if (gameType === "botGame" && difficulty === "easy") {
      _Player1.pushMarkToBoard(index);
      interfaceModule.renderBoard(index);
      let botIndex = Math.floor(Math.random() * (9 - 0) + 0);
      _easyBot(botIndex);
    } else if (gameType === "botGame" && difficulty === "hard") {
      let currentBoard = minimaxModule.getCurrentBoardIndexed();

      _Player1.pushMarkToBoard(index);
      interfaceModule.renderBoard(index);
      minimaxModule.minimax(currentBoard, _Player1.mark);

      currentBoard = minimaxModule.getCurrentBoardIndexed();
      let bestChoice = minimaxModule.minimax(currentBoard, _Player2.mark);
      _Player2.pushMarkToBoard(bestChoice.index);
      interfaceModule.renderBoard(bestChoice.index);
    }
  }

  //generate index for bot selection and process it if the field is not already filled out
  function _easyBot(botIndex) {
    if (_boardArr[botIndex] === "" || getGameStatus() != "not over") {
      _Player2.pushMarkToBoard(botIndex);
      interfaceModule.renderBoard(botIndex);
      return;
    }
    let newIndex = Math.floor(Math.random() * (9 - 0) + 0);
    _easyBot(newIndex);
  }

  function resetCount() {
    _count = 0;
  }

  return {
    setBoard,
    getBoard,
    resetBoard,
    getGameStatus,
    setPlayers,
    getPlayers,
    playGame,
    resetCount
  }
})();

//factory function for players
function Player(slot, name) {
  const mark = (slot === 1) ? "x" : "o";
  const pushMarkToBoard = (index) => gameModule.setBoard(mark, index);

  return {
    name,
    mark,
    pushMarkToBoard
  };
}

//minimax module
const minimaxModule = (function () {

  //store the board’s current state in an array and define each mark's owner
  function getCurrentBoardIndexed() {
    let board = gameModule.getBoard();
    let index = -1;
    let indexedBoard = board.map((field) => {
      index++;
      if (field === "") {
        return field = index;
      } else {
        return field;
      }
    })
    return indexedBoard;
  }

  let currentBoardState = getCurrentBoardIndexed();
  const humanMark = "x";
  const botMark = "o";

  //get the indexes of all the empty fields
  function getEmptyFieldsIndexes(currBdSt) {
    return currBdSt.filter(field => field != "x" && field != "o");
  }

  function determineWinner(currBdSt, currMark) {
    if (
      (currBdSt[0] === currMark && currBdSt[1] === currMark && currBdSt[2] === currMark) ||
      (currBdSt[3] === currMark && currBdSt[4] === currMark && currBdSt[5] === currMark) ||
      (currBdSt[6] === currMark && currBdSt[7] === currMark && currBdSt[8] === currMark) ||
      (currBdSt[0] === currMark && currBdSt[3] === currMark && currBdSt[6] === currMark) ||
      (currBdSt[1] === currMark && currBdSt[4] === currMark && currBdSt[7] === currMark) ||
      (currBdSt[2] === currMark && currBdSt[5] === currMark && currBdSt[8] === currMark) ||
      (currBdSt[0] === currMark && currBdSt[4] === currMark && currBdSt[8] === currMark) ||
      (currBdSt[2] === currMark && currBdSt[4] === currMark && currBdSt[6] === currMark)
    ) {
      return true;
    } else {
      return false;
    }
  }

  //the minimax algorithm
  function minimax(currBdSt, currMark) {

    //store indexes of all empty fields
    const emptyFields = getEmptyFieldsIndexes(currBdSt);

    //check if game is over
    if (determineWinner(currBdSt, humanMark)) {
      return { score: -1 };
    } else if (determineWinner(currBdSt, botMark)) {
      return { score: 1 };
    } else if (emptyFields.length === 0) {
      return { score: 0 };
    }

    //store outcomes of test drives
    const allTestPlays = [];

    //loop through each empty field
    for (let i = 0; i < emptyFields.length; i++) {
      const currentTestPlay = {};

      currentTestPlay.index = currBdSt[emptyFields[i]];
      currBdSt[emptyFields[i]] = currMark;

      if (currMark === botMark) {
        const result = minimax(currBdSt, humanMark);
        currentTestPlay.score = result.score
      } else {
        const result = minimax(currBdSt, botMark);
        currentTestPlay.score = result.score;
      }

      //reset current board to pre test state
      currBdSt[emptyFields[i]] = currentTestPlay.index;
      allTestPlays.push(currentTestPlay);
    }

    let bestTestPlay = null;

    if (currMark === botMark) {
      let bestScore = -Infinity;
      for (let i = 0; i < allTestPlays.length; i++) {
        if (allTestPlays[i].score > bestScore) {
          bestScore = allTestPlays[i].score;
          bestTestPlay = i;
        }
      }
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < allTestPlays.length; i++) {
        if (allTestPlays[i].score < bestScore) {
          bestScore = allTestPlays[i].score;
          bestTestPlay = i;
        }
      }
    }

    return allTestPlays[bestTestPlay];
  }
  //first invocation
  const bestMove = minimax(currentBoardState, botMark);

  return {
    getCurrentBoardIndexed,
    minimax
  };
})();

//interface module
const interfaceModule = (function () {
  let boardArr = gameModule.getBoard();
  //DOM render status to page
  function _renderStatus(index) {
    let Players = gameModule.getPlayers();
    let Player1 = Players[0];
    let Player2 = Players[1];
    let statusDiv = document.querySelector("#status");

    let checkBoard = boardArr.every((mark) => {
      mark === "";
    })
    if (checkBoard === true) {
      statusDiv.textContent = `It's ${Player1.name}'s turn!`;
    }

    let status = gameModule.getGameStatus();
    switch (status) {
      case "x":
        statusDiv.textContent = `${Player1.name} wins!`;
        _addRestartButton();
        break;
      case "o":
        statusDiv.textContent = `${Player2.name} wins!`;
        _addRestartButton();
        break;
      case "tie":
        statusDiv.textContent = "Tie!";
        _addRestartButton();
        break;
      case "not over":
        if (gameType === "humanGame") {
          let boardArr = gameModule.getBoard();
          let mark = boardArr[index];
          mark === "x" ? statusDiv.textContent = `It's ${Player2.name}'s turn!` : statusDiv.textContent = `It's ${Player1.name}'s turn!`;
          break;
        }
    }
  }

  function _resetStatus() {
    let statusDiv = document.querySelector("#status");
    statusDiv.textContent = "";
  }

  //DOM render board content to page
  function renderBoard(index) {
    let selector = "#f" + index;
    let boardField = document.querySelector(selector);
    if (boardField != null) {
      boardField.firstElementChild.classList.add("fadeMark");
      boardField.firstElementChild.textContent = boardArr[index];
    }
  }

  //DOM click event for gameboard fields
  let count = 0;
  const _fieldNodes = document.querySelectorAll(".field");
  for (let i = 0; i < _fieldNodes.length; i++) {
    _fieldNodes[i].addEventListener(("click"), (e) => {
      let status = gameModule.getGameStatus();
      if (e.target.textContent === "" && status === "not over") {
        gameModule.playGame(gameType, difficulty, i);
      }
      _renderStatus(i);
    })
  }

  function _resetFields() {
    for (let i = 0; i < _fieldNodes.length; i++) {
      _fieldNodes[i].firstElementChild.textContent = "";
      _fieldNodes[i].firstElementChild.classList.remove("fadeMark");
    }
  }

  //reload event on header text
  const title = document.querySelector("#descr");
  title.addEventListener(("click"), () => {
    location.reload();
  })

  //DOM path from welcome screen to playing the game
  const boardDiv = document.querySelector("#board");
  const boardActionDiv = document.querySelector("#boardAction");
  const startButton = document.querySelector("#startButton");
  const startGameDiv = document.querySelector("#startGame");
  const inputOne = document.createElement("input");
  const inputTwo = document.createElement("input");
  const submitButton = document.createElement("p");
  let restartButton;
  let gameType;
  let difficulty;

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
    _addHumanButtonEvent();
    _addBotButtonEvent();
  })

  function _addHumanButtonEvent() {
    const humanButton = document.querySelector("#humanButton");
    const botButton = document.querySelector("#botButton");
    humanButton.addEventListener(("click"), () => {
      gameType = "humanGame";
      step.textContent = "Please enter a name";

      const pOne = document.createElement("p");
      pOne.textContent = "Player 1:";
      startGameDiv.appendChild(pOne);
      startGameDiv.appendChild(inputOne);

      const pTwo = document.createElement("p");
      pTwo.textContent = "Player 2:";
      startGameDiv.appendChild(pTwo);
      startGameDiv.appendChild(inputTwo);

      humanButton.remove();
      botButton.remove();

      _setSubmitButton();
      startGameDiv.appendChild(submitButton)
      _addSubmitButtonEvent();
    })
  }

  function _addBotButtonEvent() {
    const humanButton = document.querySelector("#humanButton");
    const botButton = document.querySelector("#botButton");
    botButton.addEventListener(("click"), () => {
      gameType = "botGame";
      step.textContent = "Please choose difficulty";

      const easyButton = document.createElement("p");
      easyButton.id = "easyButton";
      easyButton.classList.add("button");
      easyButton.textContent = "Easy";
      startGameDiv.appendChild(easyButton);

      const hardButton = document.createElement("p");
      hardButton.id = "hardButton";
      hardButton.classList.add("button");
      hardButton.textContent = "Hard";
      startGameDiv.appendChild(hardButton);

      humanButton.remove();
      botButton.remove();

      _addDifficultyButtonsEvent([easyButton, hardButton]);
    })
  }

  function _addDifficultyButtonsEvent(buttonsArray) {
    buttonsArray.forEach((button) => {
      button.addEventListener(("click"), () => {
        step.textContent = "Please enter a name";
        const pOne = document.createElement("p");
        pOne.textContent = "Player 1:";
        startGameDiv.appendChild(pOne);
        startGameDiv.appendChild(inputOne);

        buttonsArray[0].remove();
        buttonsArray[1].remove();

        _setSubmitButton();
        startGameDiv.appendChild(submitButton)
        _addSubmitButtonEvent();
      })
    })
    buttonsArray[0].addEventListener(("click"), () => {
      difficulty = "easy";
    })
    buttonsArray[1].addEventListener(("click"), () => {
      difficulty = "hard";
    })
  }

  function _setSubmitButton() {
    submitButton.id = "submit";
    submitButton.classList.add("button");
    submitButton.textContent = "Submit";
  }

  function _addSubmitButtonEvent() {
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
        _renderStatus();
      }
    })
  }

  function _addRestartButton() {
    //check if there is already a restartButton
    let restartCheck = document.querySelector("#restart");
    if (restartCheck === null) {
      restartButton = document.createElement("p");
      restartButton.id = "restart";
      restartButton.className = "button";
      restartButton.textContent = "Restart";
      _addRestartButtonEvent();
      boardActionDiv.appendChild(restartButton);
    }
  }

  function _addRestartButtonEvent() {
    restartButton.addEventListener(("click"), () => {
      gameModule.resetBoard();
      gameModule.resetCount();
      _resetFields();
      _resetStatus();
      _renderStatus();
      restartButton.remove();
    })
  }

  return {
    renderBoard
  }
})();