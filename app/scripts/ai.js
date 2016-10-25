/*
 * Constructs an action that the ai player could make
 * @param pos [Number]: the cell position the ai would make its action in
 * made that action
 */
var AIAction = function (pos) {

    // the position on the board that the action would put the letter on
    this.movePosition = pos;

    // the minimax value of the state that the action leads to when applied
    this.minimaxVal = 0;

    /*
     * applies the action to a state to get the next state
     * @param state [State]: the state to apply the action to
     * @return [State]: the next state
     */
    this.applyTo = function (state) {
        var next = new State(state);

        //put the letter on the board
        next.board[this.movePosition] = state.turn;

        if (state.turn === "O")
            next.oMovesCount++;

        next.advanceTurn();

        return next;
    }
};

/*
 * defines a rule for sorting AIActions in ascending manner
 * @param firstAction [AIAction] : the first action in a pairwise sort
 * @param secondAction [AIAction]: the second action in a pairwise sort
 * @return [Number]: -1, 1, or 0
 */
AIAction.ASCENDING = function (firstAction, secondAction) {
    if (firstAction.minimaxVal < secondAction.minimaxVal)
        return -1; //indicates that firstAction goes before secondAction
    else if (firstAction.minimaxVal > secondAction.minimaxVal)
        return 1; //indicates that secondAction goes before firstAction
    else
        return 0; //indicates a tie
}

/*
 * defines a rule for sorting AIActions in descending manner
 * @param firstAction [AIAction] : the first action in a pairwise sort
 * @param secondAction [AIAction]: the second action in a pairwise sort
 * @return [Number]: -1, 1, or 0
 */
AIAction.DESCENDING = function (firstAction, secondAction) {
    if (firstAction.minimaxVal > secondAction.minimaxVal)
        return -1; //indicates that firstAction goes before secondAction
    else if (firstAction.minimaxVal < secondAction.minimaxVal)
        return 1; //indicates that secondAction goes before firstAction
    else
        return 0; //indicates a tie
}

/*
 * Constructs an AI player with a specific level of intelligence
 * @param level [String]: the desired level of intelligence
 */
var AI = function (level) {

    // level of intelligence the player has
    var levelOfIntelligence = level;

    // the game the player is playing
    var game = {};

    /*
     * recursive function that computes the minimax value of a game state
     * @param state [State] : the state to calculate its minimax value
     * @returns [Number]: the minimax value of the state
     */
    function minimaxValue(state) {
        if (state.isTerminal()) {
            //a terminal game state is the base case
            return Game.score(state);
        } else {
            var stateScore; // this stores the minimax value we'll compute

            if (state.turn === "X")
            // initialize to a value smaller than any possible score
                stateScore = -1000;
            else
            //  for O, initialize to a value larger than any possible score
                stateScore = 1000;

            var availablePositions = state.emptyCells();

            //enumerate next available states using the info form available positions
            var availableNextStates = availablePositions.map(function (pos) {
                var action = new AIAction(pos);

                var nextState = action.applyTo(state);

                return nextState;
            });

            /* calculate the minimax value for all available next states
             * and evaluate the current state's value */
            availableNextStates.forEach(function (nextState) {
                var nextScore = minimaxValue(nextState);
                if (state.turn === "X") {
                    // X wants to maximize --> update stateScore iff nextScore is larger
                    if (nextScore > stateScore)
                        stateScore = nextScore;
                } else {
                    // O wants to minimize --> update stateScore iff nextScore is smaller
                    if (nextScore < stateScore)
                        stateScore = nextScore;
                }
            });

            return stateScore;
        }
    }

    /*
     * make the ai player take a move
     * @param turn [String]: the player to play, either X or O
     */
    function makeMove(turn) {
        var available = game.currentState.emptyCells();

        //enumerate and calculate the score for each avaialable actions to the ai player
        var availableActions = available.map(function(pos) {
            var action =  new AIAction(pos); //create the action object
            var next = action.applyTo(game.currentState); //get next state by applying the action

            action.minimaxVal = minimaxValue(next); //calculate and set the action's minmax value

            return action;
        });

        if(turn === "X")
        //  sort the actions in a descending manner to have the action with maximum minimax at first
            availableActions.sort(AIAction.DESCENDING);
        else
        // sort the actions in an ascending manner to have the action with minimum minimax at first
            availableActions.sort(AIAction.ASCENDING);

        var chosenAction = availableActions[0];
        var next = chosenAction.applyTo(game.currentState);
        ui.insertAt(chosenAction.movePosition, turn);
        game.advanceTo(next);
    }

    /*
     * specify the game the ai player will play
     * @param _game [Game] : the game the ai will play
     */
    this.plays = function (_game) {
        game = _game;
    };

    /*
     * notify the ai player that it's its turn
     * @param turn [String]: the player to play, either X or O
     */
    this.notify = function (turn) {
        makeMove(turn);
    };
};