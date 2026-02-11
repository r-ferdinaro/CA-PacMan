'use strict'

const GHOST = '&#9781'
const eatableColor = '#db08a6b8'
var gGhosts = []
var gGhostsInterval

function createGhosts(board) {
    // Create 3 ghosts and an interval
    for (var i = 0; i < 3; i++){
        createGhost(board)
    }
    gGhostsInterval = setInterval(moveGhosts, 1000)
}

function createGhost(board) {
    // Create a ghost with arbitrary start pos & currCellContent
    const ghost = {
        isAlive: true,
        pos: { i: 3, j: 3 },
        currCellContent: FOOD,
        color: getRandomHexColor()
    }
    // Add the ghost to the ghosts array
    gGhosts.push(ghost)

    // Update the board
    board[ghost.pos.i][ghost.pos.j] = GHOST
}

function moveGhosts() {
    // loop through ghosts
    for (var i = 0; i < gGhosts.length; i++){
        moveGhost(gGhosts[i])
    }
}

function moveGhost(ghost) {
    // don't move dead ghoses
    if (!ghost.isAlive) return

    // figure out moveDiff, nextPos, nextCell
    const diff = getMoveDiff()
    const nextPos = {
        i: ghost.pos.i + diff.i,
        j: ghost.pos.j + diff.j,
    }
    const nextCell = gBoard[nextPos.i][nextPos.j]
    
    // return if cannot move
    if (nextCell === WALL || nextCell === GHOST || nextCell === CHERRY) return

    // gameover or kill ghost if eating pacman
    if (nextCell === PACMAN) {
        if (gPacman.isSuper) {
            killGhostAudio.currentTime = 0
            killGhostAudio.play()
            ghost.isAlive = false
        } else {
            gameOver(false)
            return
        }
    }

    // moving from current pos:
    gBoard[ghost.pos.i][ghost.pos.j] = ghost.currCellContent
    renderCell(ghost.pos, ghost.currCellContent)
    
    // change and render ghost curr & next positions only if ghost is alive
    if (ghost.isAlive) {
        ghost.pos = nextPos
        ghost.currCellContent = nextCell
    
        gBoard[ghost.pos.i][ghost.pos.j] = GHOST
        renderCell(ghost.pos, getGhostHTML(ghost))
    }
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

// render ghost with its own color or edible color 
function getGhostHTML(ghost) {
    const color = (gPacman.isSuper) ? eatableColor : ghost.color
    
    return `<span style="color: ${color}">${GHOST}</span>`
}

// ***** Remove me if not needed
// change all ghosts state to edible / non-edible
//function ghostsEdibleState(isEdible) {    
//    for (let ghost in gGhosts) {
//        const currGhost = gGhosts[ghost]
//
//        // no need to make dead ghosts edible
//        if (!currGhost.isAlive) continue
//
//        currGhost.isEatable = isEdible
//        renderCell(currGhost.pos, getGhostHTML(currGhost))
//    }
//}

function renderGhosts() {    
    for (let ghost in gGhosts) {
        const currGhost = gGhosts[ghost]

        // no need to make dead ghosts edible
        if (!currGhost.isAlive) continue

        renderCell(currGhost.pos, getGhostHTML(currGhost))
    }
}

// kill ghost and update score if stood on food
function removeGhost(position) {
    for (let ghost in gGhosts) {
        const currGhost = gGhosts[ghost]

        if (currGhost.pos.i === position.i && currGhost.pos.j === position.j) {
            currGhost.isAlive = false
            if (currGhost.currCellContent === FOOD) updateScore(1, true)
            return
        }
    } 
}

// revive all dead ghosts in random cells
function reviveGhosts() {
    for (let ghost in gGhosts) {
        const currGhost = gGhosts[ghost]

        // no need to revive living ghosts
        if (currGhost.isAlive) continue 


        if (
            gBoard[currGhost.pos.i][currGhost.pos.i] === PACMAN ||
            gBoard[currGhost.pos.i][currGhost.pos.i] === GHOST ||
            gBoard[currGhost.pos.i][currGhost.pos.i] === CHERRY
        ) {
            let targetCell = getRandomFloorCell(true) 

            currGhost.pos = targetCell.pos
            currGhost.currCellContent = targetCell.currCellContent
            
        } else {
            currGhost.currCellContent = EMPTY
        }
        currGhost.isAlive = true
    }
}