var board = Chessboard('board', {
    draggable: true,
    dropOffBoard: 'trash',
    sparePieces: true,
    onDrop: handleMove,
});

var game = new Chess();

function evaluateBoard(board) {
    return Math.random();
}

function handleMove(source, target) {
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' 
    });

    var checkSound = document.getElementById("checkSound2");
    checkSound.play();

    if (move === null) {
        var checkSound = document.getElementById("checkSound3");
        checkSound.play();
        return 'snapback';
    }

    if (game.in_stalemate()) {
        $(".notification").addClass('show');
        setTimeout(function() {
            $(".notification").removeClass('show');
        }, 3000);
        return;
    }

    if (game.in_threefold_repetition()) {
        $(".notification-2").addClass( 'show');
        setTimeout(function() {
            $(".notification-2").removeClass('show');
        }, 3000);
        return;
    }

    if (game.insufficient_material()) {
        $(".notification").addClass('show');
        setTimeout(function() {
            $(".notification").removeClass('show');
        }, 3000);
        return;
    }

    if (game.in_draw()) {
        $(".notification-2").addClass('show');
        setTimeout(function() {
            $(".notification-2").removeClass('show');
        }, 3000);
        return;
    }

    if (game.in_check()) {
        var checkSound = document.getElementById("checkSound");
        checkSound.play();
    }

    if (game.game_over()) {
        var checkSound = document.getElementById("checkSound4");
        checkSound.play();
        $(".notification").addClass('show');
        setTimeout(function() {
            $(".notification").removeClass('show');
        }, 3000);
        return;
    }

    setTimeout(makeComputerMove, 250);
}

function ids(chess, depthLimit) {
    for (let depth = 1; depth <= depthLimit; depth++) {
        let result = depthLimitedSearch(chess, depth);
        if (result) return result;
    }
    return null;
}

function depthLimitedSearch(chess, depth) {
    if (depth === 0 || chess.game_over()) {
        return evaluateBoard(chess.board());
    }

    let bestMove = null;
    let bestValue = -Infinity;

    chess.moves().forEach(move => {
        chess.move(move);
        let value = -depthLimitedSearch(chess, depth - 1);
        chess.undo();

        if (value > bestValue) {
            bestValue = value;
            bestMove = move;
        }
    });

    return bestMove;
}

function makeComputerMove() {
    let bestMove = ids(game, 6);
    if (bestMove === null) {
        var checkSound = document.getElementById("checkSound3");
        checkSound.play();
        return 'snapback';
    }

    game.move(bestMove);
    board.position(game.fen());
    console.log("Best move by computer:", bestMove);
    var checkSound = document.getElementById("checkSound1");
    checkSound.play();

    if (game.in_check()) {
        var checkSound = document.getElementById("checkSound");
        checkSound.play();
    }

    if (game.game_over()) {
        var checkSound = document.getElementById("checkSound4");
        checkSound.play();
        $(".notification").addClass('show');
        setTimeout(function() {
            $(".notification").removeClass('show');
        }, 3000);
    }
}

$(document).ready(function () {
    $('#startBtn').on('click', function () {
        game.reset();  
        board.start();
        $(".notification").removeClass('show');
    });

    $("#playAgain").on('click', function () {
        game.reset();  
        board.start(); 
        $(".notification").removeClass('show'); 
    });

    $("#clearNotificationBtn").on('click', function () {
        $(".notification").removeClass('show');
    });

    document.getElementById('solveButton').addEventListener('click', function () {
        let bestMove = ids(game, 6);
        if (bestMove) {
            game.move(bestMove);
            board.position(game.fen());
            var checkSound = document.getElementById("checkSound1");
            checkSound.play();
            console.log("Best move:", bestMove);
        } else {
            console.log("No move found.");
        }
    });
});
