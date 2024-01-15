import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows, ncols, chanceLightStartsOn }) {
    const genRandomOnOrOf = () => (Math.random().toFixed(1) <= chanceLightStartsOn ? true : false)

    const [board, setBoard] = useState(createBoard());

    /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
    function createBoard() {
        let initialBoard = [];

        for (let r = 0; r < nrows; r++) {
            const row = Array.from({ length: ncols }, x => genRandomOnOrOf())
            initialBoard.push(row);
        }

        return initialBoard;
    }

    //check win con
    const hasWon = () => board.every(row => row.every(value => value === false));

    function flipCellsAround(coord) {
        setBoard(oldBoard => {
            const [y, x] = coord.split("-").map(Number);
            const coords = [[y, x], [y, x - 1], [y - 1, x], [y, x + 1], [y + 1, x]];

            const flipCell = (y, x, boardCopy) => {
                if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
                    boardCopy[y][x] = !boardCopy[y][x];
                }
            };

            const boardCopy = oldBoard.map(row => [...row]);            
            coords.forEach(coord => flipCell(coord[0], coord[1], boardCopy));
            return boardCopy;
        });
    }

    // if the game is won, just show a winning msg & render nothing else
    if(hasWon()) return 'Winner!';

    // make table board
    return (
        <table className="Board">
            <tbody>
                {board.map((row, yCoord) =>
                    <tr key={yCoord}>
                        {row.map((lightValue, xCoord) => <Cell key={`${yCoord}-${xCoord}`} coord={`${yCoord}-${xCoord}`} flipCellsAroundMe={flipCellsAround} isLit={lightValue} />)}
                    </tr>
                )}
            </tbody>
        </table>
    );
}

export default Board;
