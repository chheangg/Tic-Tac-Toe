
const double = document.querySelector('.double');

// Player factory Function
const players = function(name, turnID, side) {
    return {name, turnID, side}
}

// create Two Players and assign them a side
const playersList = (function() {
    const playerOne = players('Player One', 0, null);
    const playerTwo = players('Player Two', 0, null);
    // find a randomside for player one
    const _randSide = function() {
        let randValue = Math.floor(Math.random() * 2);
        let side;
        if (randValue == 0) {
            side = 'X';
        } else {
            side = 'O';
        }
        return side;
    }
    // find a side for player two based on player one
    const _autoSet = function() {
        if ( playerOne.side == 'X' ) {
            return 'O';
        } else if (playerOne.side == 'O') {
            return 'X';
        }
    }

    playerOne.side = _randSide();
    playerTwo.side = _autoSet();

    return [playerOne, playerTwo];
})()

// Board Array (With this, we can even create much more!)
const gameBoard = (function() {
    const arrayBoard = {};
    for ( i = 0; i < 3; i++ ) {
        arrayBoard[i] = [];
        for ( h = 0; h < 3; h++ ) {
            arrayBoard[i].push(null);
        }
    }
    return arrayBoard;
})()

// Module that controls the displaying of content
const displayController = (function() {

    // produce a winning screen, and reset the game + array
    const winScreen = function(winner, winnerSide) {
        const modal = document.querySelector('.modal-bg');
        const button = document.querySelector('.continue');
        const text = document.querySelector('.modal-container p');
        text.textContent = `${winner} has won the game! (Side ${winnerSide})`

        modal.style.display = "flex";
        double.style.backgroundColor = "whitesmoke";
        button.addEventListener('click', clearBoard);
    }

    // produce a tie screen, and reset the game + array
    const tieScreen = function() {
        const modal = document.querySelector('.modal-bg');
        const button = document.querySelector('.continue');
        const text = document.querySelector('.modal-container p');
        text.textContent = `It's a tie :(`;

        modal.style.display = "flex";
        double.style.backgroundColor = "whitesmoke";
        button.addEventListener('click', clearBoard);
    }

    // loop through each board array and display them
    const displayBoard = function() {
        for ( value in gameBoard ) {
            let column = 0;
            gameBoard[value].forEach((object) => {
                let box = document.createElement('span');
                let objectPlacement = document.createElement('a');
                box.classList.add('box', `box-${value}`);
                objectPlacement.classList.add('box-content');
                objectPlacement.setAttribute('data-key', `${value + column}`);
                objectPlacement.textContent = object;

                let container = document.querySelector('.box-container');
                box.appendChild(objectPlacement);
                container.appendChild(box);
                column += 1;
            })
        }
    }
    const clearBoard = function() {
        document.querySelector('.modal-bg').style.display = "none";
        for ( value in gameBoard ) {
            for ( i = 0; i < gameBoard[value].length; i++) {
                gameBoard[value][i] = null;
            }
        }
        const body = document.querySelector('body');
        const boxes = document.querySelectorAll('.box-content');
        boxes.forEach((box) => {
            box.textContent = null;
        })
    }
    return {displayBoard, winScreen, tieScreen};
})();

// Main module that controls the game and its function
const gameController = (function() {
    const rowBoard = function() {
        return gameBoard;
    }
    const arrayBoard = function() {
        return gameBoard[0].concat(gameBoard[1], gameBoard[2])
    }
    const _evaluateRound = function() {
        let board = rowBoard();
        for ( player of playersList ) {
            for ( value in board ) {
                if (board[value][0] == board[value][1] && board[value][0] == board[value][2] && board[value][0] != null) {
                    displayController.winScreen(player.name, player.side);
                }
            }
            board = arrayBoard();
            for ( i = 0; i < board.length; i++ ) {
                if (board[i] == board[i+3] && board[i] == board[i+6] && board[i] != null) {
                    displayController.winScreen(player.name, player.side);
                    break;
                } else if (board[i] == board[i+4] && board[i] == board[i+8] && board[i] != null) {
                    displayController.winScreen(player.name, player.side);
                    break
                } else if (board[2] == board[4] && board[2] == board[6] && board[2] != null) {
                    displayController.winScreen(player.name, player.side);
                    break
                } else if ( board.includes(null) == false ) {
                    displayController.tieScreen();
                    break
                } else {
                    return;
                }
            }
        }
    } 
    const boxListener = function() {
        double.style.backgroundColor = "silver";
        const boxes = document.querySelectorAll('.box-content');
        boxes.forEach((box) => {
            box.addEventListener('click', _addContent);
            box.addEventListener('click', _evaluateRound);
        })
    };
    //add content if detected click
    //don't add them if already filled
    //gameBoard array mirrored
    const _addContent = function(box) {
        const boxes = document.querySelectorAll('.box-content');
        const boxID = box.target.getAttribute('data-key');
        for ( player of playersList ) {
                if ( box.target.textContent != '') {
                    return;
                }
                if ( player.turnID == 0 ) {
                    gameBoard[boxID.charAt(0)][boxID.charAt(1)] = player.side;
                    box.target.textContent = player.side;
                    //Changes the turnID which decide the move for next round
                    player.turnID = 1;
                    playersList.forEach((otherPlayer) => {
                        if ( otherPlayer.side != player.side ) {
                            otherPlayer.turnID = 0;
                        }
                    })
                    break;
                } 
        };
    };

    displayController.displayBoard();
    return {boxListener};

})();

double.addEventListener('click', gameController.boxListener);