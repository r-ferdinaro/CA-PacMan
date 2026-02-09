'use strict'

const GHOST = '&#9781'
var gGhosts = []

var gGhostsInterval

function createGhosts(board) {
    // TODO: Create 3 ghosts and an interval
    for (var i = 0; i < 3; i++){
        createGhost(board)
    }
    gGhostsInterval = setInterval(moveGhosts, 1000)
}

function createGhost(board) {
    // TODO: Create a ghost with arbitrary start pos & currCellContent
    const ghost = {
        pos: { i: 3, j: 3 },
        currCellContent: FOOD,
    }
    // TODO: Add the ghost to the ghosts array
    gGhosts.push(ghost)

    // TODO: Update the board
    board[ghost.pos.i][ghost.pos.j] = GHOST
}

function moveGhosts() {
    // TODO: loop through ghosts
    for (var i = 0; i < gGhosts.length; i++){
        moveGhost(gGhosts[i])
    }
}

function moveGhost(ghost) {
    // TODO: figure out moveDiff, nextPos, nextCell
    const diff = getMoveDiff()
    const nextPos = {
        i: ghost.pos.i + diff.i,
        j: ghost.pos.j + diff.j,
    }
    const nextCell = gBoard[nextPos.i][nextPos.j]
    
    // TODO: return if cannot move
    if (nextCell === WALL || nextCell === GHOST) return

    // TODO: hitting a pacman? call gameOver
    if (nextCell === PACMAN) {
        gameOver(false)
        return
    }

    // TODO: moving from current pos:
    // TODO: update the model (restore prev cell contents)
    gBoard[ghost.pos.i][ghost.pos.j] = ghost.currCellContent
    
    // TODO: update the DOM
    renderCell(ghost.pos, ghost.currCellContent)
    
    // TODO: Move the ghost to new pos:
    // TODO: update the model (save cell contents so we can restore later)
    ghost.pos = nextPos
    ghost.currCellContent = nextCell
    
    gBoard[ghost.pos.i][ghost.pos.j] = GHOST

    // TODO: update the DOM
    renderCell(ghost.pos, getGhostHTML(ghost))
}

function getMoveDiff() {
    const randNum = getRandomIntInclusive(1, 4)

    switch (randNum) {
        case 1: return { i: 0,  j: 1  }
        case 2: return { i: 1,  j: 0  }
        case 3: return { i: 0,  j: -1 }
        case 4: return { i: -1, j: 0  }
    }
}

function getGhostHTML(ghost) {
    return `<span>${GHOST}</span>`
}