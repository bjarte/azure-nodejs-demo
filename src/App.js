// import logo from './logo.svg';
import { useState } from 'react';
import './App.css';

function Square({ value, onSquareClick }) {
  return (<button className="square" onClick={(onSquareClick)}>
    {value}
  </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {

  function handleClick(i) {

    if (squares[i]
      || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }

    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function renderSquares() {

    let cols = [],
      rows = [];

    for (let index = 0; index <= 9; index++) {

      cols.push(<Square value={squares[index]} onSquareClick={() => handleClick(index)} />)

      if ((index + 1) % 3 === 0) {
        rows.push(
          <div className="board-row">
            {cols}
          </div>
        )
        cols = [];
      }
    }

    return (
      <>
        {rows}
      </>
    )
  };

  return (
    <>
      <h4 className="status">{status}</h4>
      <div>{renderSquares()}</div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default function Game() {

  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, index) => {
    let description;

    if (index > 0) {
      description = 'Go to move ' + index;
    } else {
      description = 'Go to game start';
    }

    if (index === currentMove) {
      if (index > 0) {
        return (
          <li key={index}>You are at move {index}</li>
        );
      }

      return (
        <li key={index}>You are at the start of the game</li>
      );
    }

    return (
      <li key={index}>
        <button onClick={() => jumpTo(index)}>{description}</button>
      </li>
    );

  });

  return (
    <div className="game">
      <div className="game-board">

        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />

      </div>
      <div className="game-info">
        <h4>Game History</h4>
        <ul>{moves}</ul>
      </div>
    </div>
  );
}
