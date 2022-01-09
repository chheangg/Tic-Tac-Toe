
const double = document.querySelector('.double');
const bot = document.querySelector('.bot')

// Player factory Function
const players = function(name, turnID, side) {
    return {name, turnID, side}
}

// create Two Players and assign them a side
const playersList = (function() {
    // find a randomside for player one
    
    const _randSide = function() {
        if (Math.floor(Math.random() * 2) == 0) {
            return 'X';
        } else {
            return 'O';
        }
    }
    // find a side for player two based on player one
    const _autoSide = function() {
        if ( playerOne.side == 'X' ) {
            return 'O';
        } else if (playerOne.side == 'O') {
            return 'X';
        }
    }
    
    const _chanceX = function() {
        if (Math.floor(Math.random() * 2) == 0) {
            return '0';
        } else {
            return '1';
        }
    }

    const _chanceY = function() {
        if ( playerOne.turnID == '1' ) {
            return '0';
        } else if (playerOne.turnID == '0') {
            return '1';
        }
    }

    const _autoSet = function() {
        playerOne = players('Player One', _chanceX(), null);
        playerTwo = players('Player Two', _chanceY(), null);
        playerOne.side = _randSide();
        playerTwo.side = _autoSide();
    }

    const _reset = function() {
        playerOne.turnID = _chanceX();
        playerTwo.turnID = _chanceY();
        playerOne.side = _randSide();
        playerTwo.side = _autoSide();
        gameController.turnNumber = 0;
    }

    _autoSet();
    document.querySelector('.continue').addEventListener('click', _reset);
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
    let isWin = false;
    // produce a winning screen, and reset the game + array
    const winScreen = function(winner, winnerSide) {
        console.log(winner);
        document.querySelector('.modal-bg').style.display = "flex";
        document.querySelector('.continue').addEventListener('click', _clearBoard);
        document.querySelector('.modal-container p').textContent = `${winner} has won the game! (Side ${winnerSide})`;
        displayController.isWin = true;
    }

    // produce a tie screen, and reset the game + array
    const tieScreen = function() {
        document.querySelector('.modal-bg').style.display = "flex";
        document.querySelector('.continue').addEventListener('click', _clearBoard);
        document.querySelector('.modal-container p').textContent = "It's a tie :(";
        displayController.isWin = true;
    }

    // loop through each board array and display them
    const displayBoard = function() {
        document.querySelector('.buttons').removeChild(double);
        document.querySelector('.buttons').removeChild(bot);
        let container = document.querySelector('.box-container')
        for ( value in gameBoard ) {
            let column = 0;
            gameBoard[value].forEach((object) => {
                let box = document.createElement('span');
                let objectPlacement = document.createElement('a');
                box.classList.add('box', `box-${value}`);
                objectPlacement.classList.add('box-content');
                objectPlacement.setAttribute('data-key', `${value + column}`);
                objectPlacement.textContent = object;

                box.appendChild(objectPlacement);
                container.appendChild(box);
                column += 1;
            })
        }
    }
    const redisplayBoard = function() {
        document.querySelectorAll('.box-content').forEach((box) => {
            let boxID = box.getAttribute('data-key').split("");
            box.textContent = gameBoard[boxID[0]][[boxID[1]]];
        })
    }
    const _clearBoard = function() {
        document.querySelector('.modal-bg').style.display = "none";
        for ( value in gameBoard ) {
            for ( i = 0; i < gameBoard[value].length; i++) {
                gameBoard[value][i] = null;
            }
        }
        const boxes = document.querySelectorAll('.box-content');
        boxes.forEach((box) => {
            box.textContent = null;
        })
        botPlayer.botMode();
    }
    return {displayBoard, redisplayBoard, winScreen, tieScreen, isWin};
})();

// Main module that controls the game and its function
const gameController = (function() {
    let turnNumber = 0;
    const rowBoard = function() {
        return gameBoard;
    }
    const arrayBoard = function() {
        return gameBoard[0].concat(gameBoard[1], gameBoard[2])
    }
    const _checkPlayer = function(winValue) {
        playersList.forEach((player) => {
            if ( player.side == winValue) {
                console.log(player);
                displayController.winScreen(player.name, player.side);
            }
        })
    }
    const evaluateRound = function() {
        let board = rowBoard();
        for ( value in board ) {
            if (board[value][0] == board[value][1] && board[value][0] == board[value][2] && board[value][0] != null) {
                console.log(board[0]);
                _checkPlayer(board[value][0]);
            }
        }
        board = arrayBoard();
        for ( i = 0; i < board.length; i++ ) {
            if (board[i] == board[i+3] && board[i] == board[i+6] && (board[i] != null || board[i+3] != null)) {
                console.log(board[i]);
                _checkPlayer(board[i]);
                break;
            } else if (board[i] == board[i+4] && board[i] == board[i+8] && (board[i] != null || board[i+4] != null)) {
                console.log(board[i]);
                _checkPlayer(board[i]);
                break;
            } else if (board[2] == board[4] && board[2] == board[6] && board[2] != null) {
                console.log(board[i]);
                _checkPlayer(board[2]);
                break;
            } else if ( i == 8 && board[8] != null && board.includes(null) == false ) {
                displayController.tieScreen();
                break;
            }
        }
    } 
    const boxListener = function() {
        if ( botPlayer.isBotPlaying == true) {
        } else {
             displayController.displayBoard();
        }
        double.style.backgroundColor = "silver";
        const boxes = document.querySelectorAll('.box-content');
            boxes.forEach((box) => {
                box.addEventListener('click', addContent);
            })
    };

    //add content if detected click
    //don't add them if already filled
    //gameBoard array mirrored
    const addContent = function(box) {
        if ( Array.isArray(box) ) {
            for ( player of playersList) {
                if ( player.turnID == botPlayer.botTurnID ) {
                    if ( gameBoard[box[0]][box[1]] != null) {
                        return;
                    }
                   //change turns number
                    if ( displayController.isWin == false ) {
                        gameBoard[box[0]][box[1]] = player.side; 
                        displayController.redisplayBoard();
                        gameController.evaluateRound()
                        if ( displayController.isWin == true) {
                            displayController.isWin = false;
                            gameController.turnNumber = 0;
                            break;
                        }
                        if ( gameController.turnNumber == 0) {
                            ++gameController.turnNumber;
                        } else if ( gameController.turnNumber == 1 ) {
                            --gameController.turnNumber;
                        }
                    } 
                        break;
                }
            }
        } else {
            const boxes = document.querySelectorAll('.box-content');
            const boxID = box.target.getAttribute('data-key');
            for ( player of playersList ) {
                    if ( box.target.textContent != '') {
                        return;
                    } else if ( player.turnID == gameController.turnNumber ) {
                        gameBoard[boxID.charAt(0)][boxID.charAt(1)] = player.side;
                        displayController.redisplayBoard();
                                                //change turns number
                        if ( displayController.isWin == false ) {
                            gameController.evaluateRound()
                            if ( displayController.isWin == true) {
                                displayController.isWin = false;
                                gameController.turnNumber = 0;
                                break;
                            }
                            if ( gameController.turnNumber == 0) {
                                ++gameController.turnNumber;
                            } else if ( gameController.turnNumber == 1 ) {
                                --gameController.turnNumber;
                            }
                            if ( botPlayer.isBotPlaying == true) {
                                botPlayer.botInput();
                            }
                        } 
                        break;
                    } 
            };
        }



    };
    return {boxListener, addContent, evaluateRound, turnNumber};

})();

const botPlayer = (function() {
    let botTurnID = (() => { return playersList[1].turnID })();
    let isBotPlaying = false;

    function botEvaluate() {
            let bestRow = Math.floor(Math.random() * 3);
            let bestColumn = Math.floor(Math.random() * 3);
        return [bestRow, bestColumn];
    }

    function botInput() {
        if ( gameController.turnNumber == botTurnID) {
            let bestChoice = botEvaluate();
            if ( gameBoard[bestChoice[0]][bestChoice[1]] != null ) {
                botInput();
            } else {
                gameController.addContent(bestChoice);
            }
        }
    }
    function botMode() {
        gameController.boxListener();
        botPlayer.isBotPlaying = true;
        botInput();
    }
    return {botMode, botInput, botEvaluate, isBotPlaying, botTurnID}
})()

double.addEventListener('click', gameController.boxListener);
bot.addEventListener('click', botPlayer.botMode)