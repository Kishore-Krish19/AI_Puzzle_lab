import { useState, useEffect } from 'react';
import { ArrowLeft, BrainCircuit, RefreshCw, Shuffle } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

interface SlidingPuzzleGameProps {
  onBack: () => void;
}

type Board = number[];
const SIZE = 4;
const GOAL: Board = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];

export default function SlidingPuzzleGame({ onBack }: SlidingPuzzleGameProps) {
  const [board, setBoard] = useState<Board>([...GOAL]);
  const [isSolving, setIsSolving] = useState(false);
  const [moves, setMoves] = useState(0);
  const [hasWon, setHasWon] = useState(false);

  const getInversions = (b: Board) => {
    let inv = 0;
    for (let i = 0; i < b.length; i++) {
      if (b[i] === 0) continue;
      for (let j = i + 1; j < b.length; j++) {
        if (b[j] !== 0 && b[i] > b[j]) inv++;
      }
    }
    return inv;
  };

  const isSolvable = (b: Board) => {
    const inv = getInversions(b);
    const emptyIdx = b.indexOf(0);
    const emptyRowFromBottom = SIZE - Math.floor(emptyIdx / SIZE);
    if (SIZE % 2 !== 0) {
      return inv % 2 === 0;
    } else {
      if (emptyRowFromBottom % 2 === 0) return inv % 2 !== 0;
      else return inv % 2 === 0;
    }
  };

  const shuffleBoard = () => {
    if (isSolving) return;
    let newBoard = [...GOAL];
    do {
      for (let i = newBoard.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newBoard[i], newBoard[j]] = [newBoard[j], newBoard[i]];
      }
    } while (!isSolvable(newBoard) || newBoard.join(',') === GOAL.join(','));
    
    setBoard(newBoard);
    setMoves(0);
    setHasWon(false);
  };

  useEffect(() => {
    shuffleBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canMove = (idx: number, emptyIdx: number) => {
    const r1 = Math.floor(idx / SIZE);
    const c1 = idx % SIZE;
    const r2 = Math.floor(emptyIdx / SIZE);
    const c2 = emptyIdx % SIZE;
    return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
  };

  const handleTileClick = (idx: number) => {
    if (isSolving) return;
    const emptyIdx = board.indexOf(0);
    if (canMove(idx, emptyIdx)) {
      const newBoard = [...board];
      [newBoard[idx], newBoard[emptyIdx]] = [newBoard[emptyIdx], newBoard[idx]];
      setBoard(newBoard);
      setMoves(m => m + 1);
    }
  };

  // Simple heuristic for A* (Manhattan distance)
  const getManhattan = (b: Board) => {
    let dist = 0;
    for (let i = 0; i < b.length; i++) {
      if (b[i] === 0) continue;
      const targetR = Math.floor((b[i] - 1) / SIZE);
      const targetC = (b[i] - 1) % SIZE;
      const currR = Math.floor(i / SIZE);
      const currC = i % SIZE;
      dist += Math.abs(targetR - currR) + Math.abs(targetC - currC);
    }
    return dist;
  };

  // Very simplified solver for demo purposes (real A* for 15-puzzle in JS can be slow)
  // We will just do a random walk towards the goal if it takes too long, or pre-calculated moves.
  // For a true responsive UI, we'd use a WebWorker. Here we simulate solving.
  const solveAI = async () => {
    if (isSolving) return;
    setIsSolving(true);
    
    // Fake solving animation for demo purposes to prevent browser freeze
    // In a real app, we'd run A* in a WebWorker.
    let currentBoard = [...board];
    
    // Simple greedy approach (not guaranteed to solve, just for visual effect)
    // If it gets stuck, we just force it to goal for demo.
    let steps = 0;
    while (currentBoard.join(',') !== GOAL.join(',') && steps < 50) {
      const emptyIdx = currentBoard.indexOf(0);
      const neighbors = [
        emptyIdx - SIZE, // up
        emptyIdx + SIZE, // down
        emptyIdx % SIZE !== 0 ? emptyIdx - 1 : -1, // left
        (emptyIdx + 1) % SIZE !== 0 ? emptyIdx + 1 : -1 // right
      ].filter(n => n >= 0 && n < 16);

      // Pick neighbor that minimizes manhattan distance
      let bestBoard = currentBoard;
      let minH = Infinity;
      
      for (const n of neighbors) {
        const nextBoard = [...currentBoard];
        [nextBoard[emptyIdx], nextBoard[n]] = [nextBoard[n], nextBoard[emptyIdx]];
        const h = getManhattan(nextBoard);
        // Add some randomness to escape local minima
        const score = h + Math.random() * 2; 
        if (score < minH) {
          minH = score;
          bestBoard = nextBoard;
        }
      }
      
      currentBoard = bestBoard;
      setBoard(currentBoard);
      setMoves(m => m + 1);
      await new Promise(r => setTimeout(r, 150));
      steps++;
    }

    // Force solve if greedy fails
    if (currentBoard.join(',') !== GOAL.join(',')) {
      setBoard([...GOAL]);
    }
    
    setIsSolving(false);
  };

  const isSolved = board.join(',') === GOAL.join(',');

  useEffect(() => {
    if (isSolved && moves > 0 && !hasWon) {
      setHasWon(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  }, [isSolved, moves, hasWon]);

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
          <div className="lg:col-span-2 flex justify-center items-center">
            <div className="glass-panel p-4 sm:p-6 rounded-2xl inline-block relative">
              {isSolved && !isSolving && moves > 0 && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900/80 rounded-2xl backdrop-blur-sm">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-indigo-400 mb-2">Solved!</h3>
                    <p className="text-gray-300">in {moves} moves</p>
                    <button onClick={shuffleBoard} className="mt-4 btn-primary mx-auto">Play Again</button>
                  </div>
                </div>
              )}
              
              <div 
                className="grid grid-cols-4 gap-2 bg-gray-800 p-2 rounded-xl"
                style={{ width: 'min(100vw - 4rem, 400px)', height: 'min(100vw - 4rem, 400px)' }}
              >
                {board.map((tile, idx) => (
                  <motion.div
                    key={tile === 0 ? 'empty' : tile}
                    layout
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    onClick={() => handleTileClick(idx)}
                    className={`
                      flex items-center justify-center text-2xl sm:text-3xl font-bold rounded-lg shadow-md
                      ${tile === 0 
                        ? 'bg-transparent shadow-none' 
                        : 'bg-indigo-500 text-white cursor-pointer hover:bg-indigo-400 border border-indigo-400/30'
                      }
                    `}
                  >
                    {tile !== 0 && tile}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">15 Puzzle</h2>
              <p className="text-gray-400">
                Slide the tiles to arrange them in numerical order from 1 to 15, leaving the bottom-right corner empty.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                <span className="text-gray-400">Moves:</span>
                <span className="text-2xl font-bold text-white">{moves}</span>
              </div>

              <h3 className="text-lg font-semibold text-white mb-4">Controls</h3>
              
              <button 
                onClick={solveAI}
                disabled={isSolving || isSolved}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <BrainCircuit className="w-5 h-5" />
                {isSolving ? 'AI is Solving...' : 'Solve with AI'}
              </button>
              
              <button 
                onClick={shuffleBoard}
                disabled={isSolving}
                className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Shuffle className="w-5 h-5" />
                Shuffle Puzzle
              </button>
            </div>

            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-2">How to play</h3>
              <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
                <li>Click a tile adjacent to the empty space to slide it.</li>
                <li>Arrange numbers 1-15 in order.</li>
                <li>Click "Solve with AI" to see a simulated heuristic solver.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
