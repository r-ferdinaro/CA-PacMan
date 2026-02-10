'use strict'

const PACMAN = '😁'
const SUPERPACMAN = '😈'
var gSuperTimeout
var gPacman

function createPacman(board) {
    // TODO: initialize gPacman...
    gPacman = {
        pos: { i: 5, j: 5 },
        isSuper: false,
    }
    board[gPacman.pos.i][gPacman.pos.j] = PACMAN
}

function movePacman(ev) {

    if (!gGame.isOn) return

    // TODO: use getNextPos(), nextCell
    const currPos = gPacman.pos
    const nextPos = getNextPos(ev)
    if (!nextPos) return

    const nextCell = gBoard[nextPos.i][nextPos.j]

    // TODO: return if cannot move
    if (nextCell === WALL) return
    
    // TODO: hitting a ghost? call gameOver
    if (nextCell === GHOST) {
        gameOver(false)
        return
    }

    // avoid player from eating SuperFood while in Super mode
    if (gPacman.isSuper && nextCell === SUPERFOOD) return
    
    // update score on eating food, and use Super mode if ate Super food
    if (nextCell === FOOD || nextCell === SUPERFOOD) {
        updateScore(1)
        if (nextCell === SUPERFOOD) {
            superPacman()
        }
    }

    // TODO: moving from current pos:
    // TODO: update the model
    gBoard[currPos.i][currPos.j] = EMPTY

    // TODO: update the DOM
    renderCell(currPos, EMPTY)
    
    // TODO: Move the pacman to new pos:
    // TODO: update the model
    gPacman.pos = nextPos
    gBoard[gPacman.pos.i][gPacman.pos.j] = PACMAN
    
    // TODO: update the DOM
    let pacmanState = (!gPacman.isSuper) ? PACMAN : SUPERPACMAN
    renderCell(gPacman.pos, pacmanState)
}

function getNextPos(ev) {
    var nextPos = { i: gPacman.pos.i, j: gPacman.pos.j }
    // TODO: figure out nextPos
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
    ghostsEdibleState(true)

    //Upon 5 seconds timeout, Super power is lost, killed ghosts are revived and are not edible
    gSuperTimeout = setTimeout(() => {
        gPacman.isSuper = false

        renderCell(gPacman.pos, PACMAN)
        reviveGhosts()
        ghostsEdibleState(false)
    }, 5000)
}