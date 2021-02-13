//gameboard module
const boardModule = (function() {
  let _boardArr = new Array(9);
  
  function setBoard(mark, index) {
    _boardArr[index] = mark;
  }

  function getBoard() {
    return _boardArr;
  }
  
  return {
    setBoard,
    getBoard
  }
})();

//factory function for players
const Player = (name) => {

  const mark = (name === "Player1") ? "x" : "o";
  const pushMarkToBoard = (index) => boardModule.setBoard(mark, index);

  return {
    name,
    mark,
    pushMarkToBoard
  }
}

//display area
const displayController = (function() {
  //render board content to page
  let renderFunction = function renderBoard() {
    let boardArr = boardModule.getBoard();
    for (let i = 0; i < boardArr.length; i++) {
      let selector = "#f" + i;
      let boardField = document.querySelector(selector);
      boardField.textContent = boardArr[i];
    }
  }

  return {
    renderFunction
  }
})();

//DOM area
const DOMhandler = (function() {
  let count = 0;
  const fieldNodes = document.querySelectorAll(".field");
  for (let i = 0; i < fieldNodes.length; i++) {
    fieldNodes[i].addEventListener(("click"), () => {
      count % 2 === 0 ? Player1.pushMarkToBoard(i) : Player2.pushMarkToBoard(i);
      displayController.renderFunction();
      count++;
    })
  }

  function setIndex(index) {
    return index;
  }

  return {
    setIndex
  }
})();

const Player1 = Player("Player1");
const Player2 = Player("Player2");