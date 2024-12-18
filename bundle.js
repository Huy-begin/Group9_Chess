import Chessboard from '@chrisoakman/chessboardjs';
import Chess from 'chess.js';

// Khởi tạo chessboard với vị trí bắt đầu
const board = Chessboard('board', {
    draggable: true,
    dropOffBoard: 'trash',
    sparePieces: false,
    position: 'start'
});

const game = new Chess();

// Hàm đánh giá trạng thái bàn cờ (ví dụ đơn giản)
function evaluateBoard(board) {
    return Math.random(); // Thay thế bằng logic đánh giá thực tế
}

// Thuật toán IDS
function ids(chess, depthLimit) {
    for (let depth = 1; depth <= depthLimit; depth++) {
        let result = depthLimitedSearch(chess, depth);
        if (result) return result;
    }
    return null;
}

// Thuật toán Depth-Limited Search
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

// Xử lý sự kiện khi nhấn nút "Solve with IDS"
document.getElementById('solveButton').addEventListener('click', function() {
    let bestMove = ids(game, 3); // Tìm kiếm với độ sâu tối đa là 3
    if (bestMove) {
        game.move(bestMove);
        board.position(game.fen());
        console.log("Best move:", bestMove);
    } else {
        console.log("No move found.");
    }
});
