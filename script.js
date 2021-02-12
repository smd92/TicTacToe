//gameboard module
let boardModule = (function() {
	let _boardArr = ["x", "o", "x", "x", "o"];
  
  function getBoard() {
  	return _boardArr;
  }
  
  return {
  	getBoard
  }
})();

let boardArr = boardModule.getBoard();

//render board content to page
function renderBoard() {
  for (let i = 0; i < boardArr.length; i++) {
    let selector = "#f" + i;
    let boardField = document.querySelector(selector);
    boardField.textContent = boardArr[i];
  }
}