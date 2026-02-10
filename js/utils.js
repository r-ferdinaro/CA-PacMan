'use strict'

function renderBoard(mat, selector) {

    var strHTML = '<table><tbody>'
    for (var i = 0; i < mat.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < mat[0].length; j++) {

            const cell = mat[i][j]
            const className = `cell cell-${i}-${j}`

            strHTML += `<td class="${className}">${cell}</td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    
    const elContainer = document.querySelector(selector)
    elContainer.innerHTML = strHTML
}

// pos is an object like this - { i: 2, j: 7 }
function renderCell(pos, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${pos.i}-${pos.j}`)
    elCell.innerHTML = value
}

function getInitialFoodCount(){
    var res = 0

    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[i].length; j++) {
            if (gBoard[i][j] !== WALL && gBoard[i][j] !== SUPERFOOD) res++
        }
    }
    return res - 1
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomHexColor() {
  let randomColor = Math.floor(Math.random()*16777215).toString(16);
  
  while (randomColor.length < 6) {
    randomColor = "0" + randomColor;
  }
  return "#" + randomColor;
}

// get a random food/empty cell and its content for when ghosts are revived
function getRandomFloorCell(isGhost) {
    const emptyCells = []
    const res = {}

    for (let i = 1; i < (gBoard.length - 1); i++) {
        for (let j = 1; j < (gBoard[i].length - 1); j++) {
            if (gBoard[i][j] === EMPTY || (isGhost && gBoard[i][j] === FOOD)) {
                emptyCells.push({i: i, j: j})
            }
        }
    }

    // return if no cell is available
    if (emptyCells.length === 0) return null

    res.pos = emptyCells[getRandomIntInclusive(0, emptyCells.length - 1)]
    res.currCellContent = gBoard[res.pos.i][res.pos.j]

    return res
}