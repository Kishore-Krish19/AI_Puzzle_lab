import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, BrainCircuit, RefreshCw, Play } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

interface SudokuGameProps {
  onBack: () => void;
}

type Board = number[][];

const EMPTY = 0;

// Helper to create empty board
const createEmptyBoard = (): Board => Array(9).fill(null).map(() => Array(9).fill(EMPTY));

// A simple valid sudoku puzzle
const initialPuzzle: Board = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

export default function SudokuGame({ onBack }: SudokuGameProps) {
  const [board, setBoard] = useState<Board>(initialPuzzle.map(row => [...row]));
  const [initialBoard, setInitialBoard] = useState<Board>(initialPuzzle.map(row => [...row]));
  const [isSolving, setIsSolving] = useState(false);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [hasWon, setHasWon] = useState(false);

  const isBoardFull = board.every(row => row.every(cell => cell !== EMPTY));

  useEffect(() => {
    if (isBoardFull && !hasWon) {
      setHasWon(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  }, [isBoardFull, hasWon]);

  // Check if a number can be placed at board[row][col]
  const isValid = (board: Board, row: number, col: number, num: number): boolean => {
    for (let i = 0; i < 9; i++) {
      if (board[row][i] === num && i !== col) return false;
      if (board[i][col] === num && i !== row) return false;
    }
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[startRow + i][startCol + j] === num && (startRow + i !== row || startCol + j !== col)) {
          return false;
        }
      }
    }
    return true;
  };

  const handleCellClick = (r: number, c: number) => {
    if (isSolving || initialBoard[r][c] !== EMPTY) return;
    setSelectedCell([r, c]);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!selectedCell || isSolving) return;
    const [r, c] = selectedCell;
    
    if (e.key >= '1' && e.key <= '9') {
      const num = parseInt(e.key);
      if (isValid(board, r, c, num)) {
        const newBoard = board.map(row => [...row]);
        newBoard[r][c] = num;
        setBoard(newBoard);
      }
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
      const newBoard = board.map(row => [...row]);
      newBoard[r][c] = EMPTY;
      setBoard(newBoard);
    } else if (e.key === 'ArrowUp' && r > 0) setSelectedCell([r - 1, c]);
    else if (e.key === 'ArrowDown' && r < 8) setSelectedCell([r + 1, c]);
    else if (e.key === 'ArrowLeft' && c > 0) setSelectedCell([r, c - 1]);
    else if (e.key === 'ArrowRight' && c < 8) setSelectedCell([r, c + 1]);
  }, [selectedCell, board, isSolving]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const solveAI = async () => {
    if (isSolving) return;
    setIsSolving(true);
    setSelectedCell(null);
    setHasWon(false);
    
    // Reset to initial before solving
    const currentBoard = initialBoard.map(row => [...row]);
    setBoard(currentBoard);

    const solve = async (b: Board): Promise<boolean> => {
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (b[r][c] === EMPTY) {
            for (let num = 1; num <= 9; num++) {
              if (isValid(b, r, c, num)) {
                b[r][c] = num;
                setBoard([...b.map(row => [...row])]);
                await sleep(10); // Animation delay
                
                if (await solve(b)) return true;
                
                b[r][c] = EMPTY;
                setBoard([...b.map(row => [...row])]);
                await sleep(10);
              }
            }
            return false;
          }
        }
      }
      return true;
    };

    await solve(currentBoard);
    setIsSolving(false);
  };

  const resetBoard = () => {
    if (isSolving) return;
    setBoard(initialBoard.map(row => [...row]));
    setSelectedCell(null);
    setHasWon(false);
  };

  const generateNew = () => {
    if (isSolving) return;
    // For simplicity, just clearing the board to let user play, or we could have a list of puzzles
    const empty = createEmptyBoard();
    // Add some random valid numbers to make a simple puzzle (not guaranteed unique solution, just for demo)
    for(let i=0; i<20; i++) {
        let r = Math.floor(Math.random() * 9);
        let c = Math.floor(Math.random() * 9);
        let num = Math.floor(Math.random() * 9) + 1;
        if(empty[r][c] === EMPTY && isValid(empty, r, c, num)) {
            empty[r][c] = num;
        }
    }
    setInitialBoard(empty.map(row => [...row]));
    setBoard(empty.map(row => [...row]));
    setSelectedCell(null);
    setHasWon(false);
  };

  return (
    <div className="flex-grow flex flex-col items-center py-8 px-4">
      <div className="max-w-4xl w-full">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Games
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex justify-center">
            <div className="glass-panel p-6 rounded-2xl inline-block relative">
              {hasWon && !isSolving && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900/80 rounded-2xl backdrop-blur-sm">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-indigo-400 mb-2">Solved!</h3>
                    <button onClick={generateNew} className="mt-4 btn-primary mx-auto">Play Again</button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-9 gap-1 bg-gray-600 border-2 border-gray-600 rounded-lg overflow-hidden">
                {board.map((row, r) => (
                  row.map((cell, c) => {
                    const isInitial = initialBoard[r][c] !== EMPTY;
                    const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
                    const isThickRight = c === 2 || c === 5;
                    const isThickBottom = r === 2 || r === 5;
                    
                    return (
                      <div
                        key={`${r}-${c}`}
                        onClick={() => handleCellClick(r, c)}
                        className={`
                          w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center text-xl sm:text-2xl font-semibold cursor-pointer transition-colors
                          ${isInitial ? 'bg-gray-800 text-gray-300 cursor-not-allowed' : 'bg-gray-700 text-indigo-400 hover:bg-gray-600'}
                          ${isSelected ? 'ring-2 ring-inset ring-indigo-500 bg-gray-600' : ''}
                          ${isThickRight ? 'mr-1' : ''}
                          ${isThickBottom ? 'mb-1' : ''}
                        `}
                      >
                        {cell !== EMPTY ? cell : ''}
                      </div>
                    );
                  })
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Sudoku Solver</h2>
              <p className="text-gray-400">
                Fill the 9x9 grid so that each column, each row, and each of the nine 3x3 subgrids contain all of the digits from 1 to 9.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h3 className="text-lg font-semibold text-white mb-4">Controls</h3>
              
              <button 
                onClick={solveAI}
                disabled={isSolving}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <BrainCircuit className="w-5 h-5" />
                {isSolving ? 'AI is Solving...' : 'Solve with AI'}
              </button>
              
              <button 
                onClick={resetBoard}
                disabled={isSolving}
                className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className="w-5 h-5" />
                Reset Board
              </button>
              
              <button 
                onClick={generateNew}
                disabled={isSolving}
                className="w-full px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-all duration-300 border border-white/10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-5 h-5" />
                Generate New
              </button>
            </div>

            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-2">How to play</h3>
              <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
                <li>Click an empty cell to select it.</li>
                <li>Type a number (1-9) to fill it.</li>
                <li>Use Backspace to clear a cell.</li>
                <li>Use arrow keys to navigate.</li>
                <li>Click "Solve with AI" to watch the backtracking algorithm in action.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
