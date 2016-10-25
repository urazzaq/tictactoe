/*
 * ui object encloses all UI related methods and attributes
 */
var ui = {};

//holds the state of the intial controls visibility
ui.intialControlsVisible = true;

//holds the current visible view
ui.currentView = "";
//winner of the round
ui.winner;

/*
 * switchs the view on the UI depending on who's turn it switchs
 * @param turn [String]: the player to switch the view to
 */
ui.switchViewTo = function (turn) {

    // keep track of the scores
    if (turn == "won") {
        ui.winner = turn;
    } else if (turn == "lost") {
        ui.winner = turn;
    } else if (turn == "draw") {
        ui.winner = turn;
    } else {
        ui.winner = null;
    }
    console.log('winner', ui.winner);

    //helper function for async calling
    function _switch(_turn) {
        ui.currentView = "#" + _turn;
        $(ui.currentView).fadeIn("fast");
    }

    if (ui.intialControlsVisible) {
        //if the game is just starting
        ui.intialControlsVisible = false;

        $('.intial').fadeOut({
            duration: "slow",
            done: function () {
                _switch(turn);
            }
        });
    } else {
        //if the game is in an intermediate state
        $(ui.currentView).fadeOut({
            duration: "fast",
            done: function () {
                _switch(turn);
            }
        });
    }
};

/*
 * places X or O in the specifed place in the board
 * @param i [Number] : row number 
 * @param j [Number] : column number 
 * @param symbol [String]: X or O
 */
ui.insertAt = function (indx, symbol) {
    var board = $('.cell');
    var targetCell = $(board[indx]);

    if (!targetCell.hasClass('occupied')) {
        targetCell.html(symbol);
        targetCell.css({
            color: symbol == "X" ? "blue" : "red"
        });
        targetCell.addClass('occupied');
    }
}