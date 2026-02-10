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
    const elRestartModal = document.querySelector('.restart-modal')

    // ensure clearing all upon restart
    gGhosts = []
    clearInterval(gGhostsInterval)
    clearInterval(gCherryInterval)
    clearTimeout(gSuperTimeout)

    // create board, pacman and ghosts
    gBoard = buildBoard()
    createPacman(gBoard)
    createGhosts(gBoard)   
    
    // reset all states, counts, and cherry's interval
    gGame.isOn = true
    gGame.foodCount = getInitialFoodCount()
    gGame.score = 0
    updateScore(0, false)
    gCherryInterval = setInterval(addCherry, 15000)

    elRestartModal.setAttribute("hidden", "hidden");
    renderBoard(gBoard, '.board-container')
}

function buildBoard() {
    const size = 10
    const endCorner = size - 2
    const board = []

    for (var i = 0; i < size; i++) {
        board.push([])

        for (var j = 0; j < size; j++) {
            board[i][j] = FOOD

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
        }
    }
    return board
}

// add cherry to random empty cell in board every 15 seconds
function addCherry() {
    const targetCell = getRandomFloorCell(false)

    if (targetCell) {
        gBoard[targetCell.pos.i][targetCell.pos.j] = CHERRY
        renderCell(targetCell.pos, CHERRY)
    }
}

function updateScore(diff, decreaseCount) {
    const elScore = document.querySelector('.score')
    const elFoodCount = document.querySelector('.food-count')
    
    // update remaining food count
    gGame.score += diff
    if (decreaseCount) gGame.foodCount--
    
    // update DOM
    elScore.innerText = gGame.score
    elFoodCount.innerText = gGame.foodCount

    if (gGame.foodCount === 0) gameOver(true)
}

// stop game, delete ghosts from modal, stop ghosts from moving, and show restart modal
function gameOver(isWon = false) {
    const elRestartModal = document.querySelector('.restart-modal')
    const elUserMsg = elRestartModal.querySelector('.user-message')
    const message = (isWon) ? 'victorious' : 'Game over'

    // stop all intervals and timeouts and change game's state
    gGame.isOn = false
    clearInterval(gGhostsInterval)
    clearInterval(gCherryInterval)
    clearTimeout(gSuperTimeout)
    
    elRestartModal.removeAttribute('hidden')
    elUserMsg.innerText = `${message} | `

}
