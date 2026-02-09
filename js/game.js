'use strict'

const WALL = '&#8251;'
const FOOD = '&middot;'
const EMPTY = ' '

const gGame = {
    score: 0,
    isOn: false
}
var gBoard

function init() {
    let elRestartBtn = document.querySelector('.restart-container')
    
    gBoard = buildBoard()
    createPacman(gBoard)
    createGhosts(gBoard)
    
    renderBoard(gBoard, '.board-container')
    gGame.isOn = true
    updateScore(0)
    //elRestartBtn.style.display= 'none'
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
    // update model on score or reset to 0 if needed
    gGame.score = (diff !== 0) ? gGame.score + diff : 0 
    
    // update DOM
    const elScore = document.querySelector('.score span')
    elScore.innerText = gGame.score
}

// stop game, delete ghosts from modal, stop ghosts from moving, and show restart modal
function gameOver() {
    let elRestartBtn = document.querySelector('.restart-container')

    gGame.isOn = false
    gGhosts = []
    clearInterval(gGhostsInterval)
    
    elRestartBtn.innerHTML = '<div class="restart-modal"><p>Game over | </p> <button onclick="init()">Play again</button></div>'
    //elRestartBtn.style.display = 'block';
}