'use strict'

const PACMAN = (degrees = '0') => `<img src="img/pacman.svg" style="transform: rotate(${degrees}deg)"/>`
const SUPERPACMAN = (degrees = '0') => `<img src="img/superPacman.svg" style="transform: rotate(${degrees}deg)"/>`
var gSuperTimeout
var gPacman

function createPacman(board) {
    // initialize gPacman...
    gPacman = {
        pos: { i: 5, j: 5 },
        isSuper: false,
    }
    board[gPacman.pos.i][gPacman.pos.j] = PACMAN()
}

function movePacman(ev) {

    if (!gGame.isOn) return

    // use getNextPos(), nextCell
    const currPos = gPacman.pos
    const nextPos = getNextPos(ev)
    if (!nextPos) return

    const nextCell = gBoard[nextPos.i][nextPos.j]

    // return if cannot move
    if (nextCell === WALL) return
    
    // hitting a ghost? call gameOver
    if (nextCell === GHOST) {
        if (gPacman.isSuper) {
            removeGhost(nextPos)
        } else {
            gameOver(false)
            return
        }
    }

    // avoid player from eating SuperFood while in Super mode
    if (gPacman.isSuper && nextCell === SUPERFOOD) return
    
    // update score on eating food / Cherry / Super food
    if (nextCell === FOOD) updateScore(1, true)
    if (nextCell === CHERRY) updateScore(10, false)
    if (nextCell === SUPERFOOD) superPacman()

    // moving from current pos:
    gBoard[currPos.i][currPos.j] = EMPTY
    renderCell(currPos, EMPTY)
    
    // move the pacman to new pos:
    gPacman.pos = nextPos
    gBoard[gPacman.pos.i][gPacman.pos.j] = PACMAN()
    
    const key = ev.key
    let degree
    let pacmanState

    if (key === 'ArrowUp') degree = '-90'
    else if (key === 'ArrowDown') degree = '90'
    else if (key === 'ArrowLeft') degree = '180'
    else degree = '0'

    pacmanState = (gPacman.isSuper) ? SUPERPACMAN(degree) : PACMAN(degree)
    renderCell(gPacman.pos, pacmanState)
}

function getNextPos(ev) {
    var nextPos = { i: gPacman.pos.i, j: gPacman.pos.j }
    // figure out nextPos
    switch (ev.key) {
        case 'ArrowUp':
            nextPos.i--
            break;
    
        case 'ArrowDown':
            nextPos.i++
            break;
    
        case 'ArrowLeft':
            nextPos.j--
            break;
    
        case 'ArrowRight':
            nextPos.j++
            break;

        default:
            return null
    }
    return nextPos
}

// Super pacman allows player to kill ghosts, and changes ghosts visuals to indicate they are edible
function superPacman() {
    gPacman.isSuper = true
    renderGhosts()

    //Upon 5 seconds timeout, Super power is lost, killed ghosts are revived and are not edible
    gSuperTimeout = setTimeout(() => {
        gPacman.isSuper = false
        reviveGhosts()
        renderCell(gPacman.pos, PACMAN())
    }, 5000)
}