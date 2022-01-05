

// Create player object
const players = function() {
    const realPlayer = function() {
        
    }
}

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
    const displayBoard = function() {
        for ( value in gameBoard ) {
            gameBoard[value].forEach((object) => {
                let box = document.createElement('span');
                let objectPlacement = document.createElement('a');
                box.classList.add('box', `box-${value}`);
                objectPlacement.classList.add('box-content');
                    objectPlacement.textContent = object;

                let container = document.querySelector('.box-container');
                box.appendChild(objectPlacement);
                container.appendChild(box);
            })
        }
    }
    return {displayBoard};
})();

// Main module that controls the game and its function
const gameController = (function() {
    const playersList = [players(0, 'X'), players(1, 'O')]
    const boxListener = function() {
        let boxes = document.querySelectorAll('.box-content');
        boxes.forEach((box) => {
            box.addEventListener('click', addContent);
        })
    };

    const addContent = function(box) {
        for ( player of playersList ) {
                if ( box.target.textContent != '') {
                    return;
                }
                if ( player.turnID == 0 ) {
                    box.target.textContent = player.side;
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
    
    return {boxListener, addContent, playersList};
})();