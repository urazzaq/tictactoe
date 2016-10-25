'use strict';

var app = angular.module('tictactoeApp');

app.controller('MainCtrl', ['$scope', 'localStorageService', function ($scope, localStorageService) {
    $scope.startGame = function () {
        var aiPlayer = new AI('start');
        $scope.game = new Game(aiPlayer);
        aiPlayer.plays($scope.game);
        $scope.game.start();
    };

    $scope.clickCell = function () {
        $scope.button_clicked = false;
        angular.forEach(angular.element($(".cell")), function (value, key) {
            var cell = angular.element(value);

            cell.click(function () {
                if ($scope.game.status === "running" && $scope.game.currentState.turn === "X" && !cell.hasClass('occupied')) {
                    var indx = parseInt(cell.data("indx"));
                    var next = new State($scope.game.currentState);
                    next.board[indx] = "X";
                    ui.insertAt(indx, "X");
                    next.advanceTurn();
                    $scope.game.advanceTo(next);
                }
            })
        });
        // update scoreboard
        var container = $('.cell');
        if (ui.winner == "won") {
            $scope.wins++;
              $scope.button_clicked = true;
        } else if (ui.winner == "lost") {
            $scope.losses++;
              $scope.button_clicked = true;
        } else if (ui.winner == "draw") {
            $scope.draws++;
              $scope.button_clicked = true;
        }
    };
    // reset board and restart game
    $scope.resetGame = function () {
        angular.forEach(angular.element($(".cell")), function (value, key) {
            $scope.button_clicked = false;
            var cell = angular.element(value);
            if (cell.hasClass('occupied')) {
                cell.removeClass('occupied');
                cell.removeAttr('style');
                cell.empty();
            }
        });
        $scope.startGame();
    };


}]);