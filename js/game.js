'use strict'

const WALL = '&#8251;'
const FOOD = '&middot;'
const EMPTY = ' '

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
}

function buildBoard() {
    const size = 10
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            board[i][j] = FOOD
            
            if (i === 0 || i === size - 1 ||
                j === 0 || j === size - 1 ||
                (j === 3 && i > 4 && i < size - 2)) {
                board[i][j] = WALL
            }
        }
    }
    return board
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
    
    elRestartBtn.innerHTML = `<div class="restart-modal"><span>${message} | </span> <button onclick="init()">Play again</button></div>`
}