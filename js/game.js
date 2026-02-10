'use strict'

const WALL = '&#8251;'
const FOOD = '&middot;'
const SUPERFOOD = '&#9679;'
const CHERRY = '🍒'
const EMPTY = ' '
var gCherryInterval

const gGame = {
    score: 0,
    isOn: false,
    foodCount: 0
}
var gBoard

function init() {
    const elRestartBtn = document.querySelector('.restart-container')
    
    gBoard = buildBoard()
    createPacman(gBoard)
    createGhosts(gBoard)   
    
    gGame.isOn = true
    gGame.foodCount = getInitialFoodCount()
    updateScore(0)
    renderBoard(gBoard, '.board-container')
    elRestartBtn.innerHTML = ''

    gCherryInterval = setInterval(addCherry, 15000)
}

function buildBoard() {
    const size = 10
    const endCorner = size - 2
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            board[i][j] = FOOD

            // build board elements in Switch case instead of multiple if statements
            switch(true) {
                case (i === 0):
                case (i === size - 1):
                case (j === 0):
                case (j === size - 1):
                case (j === 3 && i > 4 && i < size - 2):
                    board[i][j] = WALL
                    break;
                case (i === 1 && j === 1):
                case (i === 1 && j === endCorner):
                case (i === endCorner && j === 1):
                case (i === endCorner && j === endCorner):
                    board[i][j] = SUPERFOOD
                    break;
            }
            
            // Kept original if statements (for Code review) in case a revert is desired
            //if (i === 0 || i === size - 1 ||
            //    j === 0 || j === size - 1 ||
            //    (j === 3 && i > 4 && i < size - 2)) {
            //    board[i][j] = WALL
            //}

            //if (i === 1 && j === 1 || 
            //    i === 1 && j === endCorner ||
            //    i === endCorner && j === 1 ||
            //    i === endCorner && j === endCorner
            //) {board[i][j] = SUPERFOOD}
        }
    }
    return board
}

// add cherry to random empty cell in board every 15 seconds
function addCherry() {
    const targetCell = getRandomFloorCell(true)

    if (targetCell) {
        gBoard[targetCell.pos.i][targetCell.pos.j] = CHERRY
        renderCell(targetCell.pos, CHERRY)
    }
}

function updateScore(diff) {
    const elScore = document.querySelector('.score')
    const elFoodCount = document.querySelector('.food-count')
    
    // update model on score or reset to 0 if needed
    // update remaining food count
    gGame.score = (diff !== 0) ? gGame.score + diff : 0 
    gGame.foodCount--
    
    // update DOM
    elScore.innerText = gGame.score
    elFoodCount.innerHTML = gGame.foodCount

    if (gGame.foodCount === 0) gameOver(true)
}

// stop game, delete ghosts from modal, stop ghosts from moving, and show restart modal
function gameOver(isWon = false) {
    const elRestartBtn = document.querySelector('.restart-container')
    const message = (isWon) ? 'victorious' : 'Game over'

    gGame.isOn = false
    gGhosts = []
    clearInterval(gGhostsInterval)
    clearInterval(gCherryInterval)
    clearTimeout(gSuperTimeout)
    
    elRestartBtn.innerHTML = `<div class="restart-modal"><span>${message} | </span> <button onclick="init()">Play again</button></div>`
}