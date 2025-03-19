const gameBoard = document.querySelector('#gameboard');
const infoDisplay = document.querySelector('#info');
const startCells = ['', '', '', '', '', '', '', '', '']; // 9 cells
let go = 'circle';

infoDisplay.textContent = 'Circle goes first';

function createBoard() {
    startCells.forEach((cell, index) => {
        const cellElement = document.createElement('div'); // creates 9 divs
        cellElement.classList.add('square'); // takes the styles for the cells
        cellElement.id = index; // gives an index id
        cellElement.addEventListener('click', addGo); // gives the cell a function
        gameBoard.append(cellElement);
    });
}

createBoard(); // let's see how it looks like

function addGo(e) {
    const goDisplay = document.createElement('div');
    goDisplay.classList.add(go); // gives the class of the actual sign (cross, circle)
    e.target.append(goDisplay); // adds the sign to the clicked div
    go = go === 'circle' ? 'cross' : 'circle'; // switch the signs
    infoDisplay.textContent = 'it is now ' + go + "'s turn";
    e.target.removeEventListener('click', addGo); // no double click on div

    checkScore();
}

function checkScore() {
    const allSquares = document.querySelectorAll('.square');
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    winningCombos.forEach((array) => {
        // check every cell in the array "winningCombos" => array.every((cell) => allSquares[cell]; [cell] = index for div
        // and look in the firstChild element => .firstChild?; ? = if exists
        // if it exist, look in the classList, if this contains the class "circle" => .classList.contains('circle')
        const circleWins = array.every((cell) => allSquares[cell].firstChild?.classList.contains('circle'));

        if (circleWins) {
            infoDisplay.textContent = 'Circle Wins!';

            // remove EventListener from all squares => allSquares.forEach
            // clone the square => square.cloneNode(true)
            // and replace it with the existing square => .replaceWith
            allSquares.forEach((square) => square.replaceWith(square.cloneNode(true)));
        }
    });

    winningCombos.forEach((array) => {
        const crossWins = array.every((cell) => allSquares[cell].firstChild?.classList.contains('cross'));

        if (crossWins) {
            infoDisplay.textContent = 'Cross Wins!';

            allSquares.forEach((square) => square.replaceWith(square.cloneNode(true)));
        }
    });
}
