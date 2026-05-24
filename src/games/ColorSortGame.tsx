import { useState, useEffect } from 'react';
import { ArrowLeft, BrainCircuit, RefreshCw, Play } from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

interface ColorSortGameProps {
  onBack: () => void;
}

type Tube = string[];

const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b'];
const TUBE_CAPACITY = 4;
const NUM_TUBES = 6; // 4 with colors, 2 empty

export default function ColorSortGame({ onBack }: ColorSortGameProps) {
  const [tubes, setTubes] = useState<Tube[]>([]);
  const [selectedTube, setSelectedTube] = useState<number | null>(null);
  const [isSolving, setIsSolving] = useState(false);
  const [moves, setMoves] = useState(0);
  const [hasWon, setHasWon] = useState(false);

  const generateLevel = () => {
    // Create solved state
    let allColors: string[] = [];
    for (let i = 0; i < COLORS.length; i++) {
      for (let j = 0; j < TUBE_CAPACITY; j++) {
        allColors.push(COLORS[i]);
      }
    }

    // Shuffle colors
    for (let i = allColors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allColors[i], allColors[j]] = [allColors[j], allColors[i]];
    }

    // Fill tubes
    const newTubes: Tube[] = Array(NUM_TUBES).fill([]).map(() => []);
    let colorIdx = 0;
    for (let i = 0; i < COLORS.length; i++) {
      for (let j = 0; j < TUBE_CAPACITY; j++) {
        newTubes[i].push(allColors[colorIdx++]);
      }
    }

    setTubes(newTubes);
    setSelectedTube(null);
    setMoves(0);
    setHasWon(false);
  };

  useEffect(() => {
    generateLevel();
  }, []);

  const handleTubeClick = (idx: number) => {
    if (isSolving) return;

    if (selectedTube === null) {
      // Select tube if it's not empty
      if (tubes[idx].length > 0) {
        setSelectedTube(idx);
      }
    } else {
      // Try to move from selectedTube to idx
      if (selectedTube === idx) {
        setSelectedTube(null); // Deselect
        return;
      }

      const sourceTube = tubes[selectedTube];
      const targetTube = tubes[idx];

      if (sourceTube.length === 0) {
        setSelectedTube(null);
        return;
      }

      const colorToMove = sourceTube[sourceTube.length - 1];

      // Can move if target is empty OR target has space AND top color matches
      if (targetTube.length < TUBE_CAPACITY && 
         (targetTube.length === 0 || targetTube[targetTube.length - 1] === colorToMove)) {
        
        const newTubes = [...tubes.map(t => [...t])];
        newTubes[selectedTube].pop();
        newTubes[idx].push(colorToMove);
        
        setTubes(newTubes);
        setMoves(m => m + 1);
      }
      
      setSelectedTube(null);
    }
  };

  const checkWin = () => {
    if (tubes.length === 0) return false;
    
    let completedTubes = 0;
    for (const tube of tubes) {
      if (tube.length === 0) continue;
      if (tube.length !== TUBE_CAPACITY) return false;
      
      const firstColor = tube[0];
      if (tube.every(c => c === firstColor)) {
        completedTubes++;
      } else {
        return false;
      }
    }
    return completedTubes === COLORS.length;
  };

  const isWon = checkWin();

  useEffect(() => {
    if (isWon && moves > 0 && !hasWon) {
      setHasWon(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  }, [isWon, moves, hasWon]);

  const solveAI = async () => {
    if (isSolving || isWon) return;
    setIsSolving(true);
    setSelectedTube(null);

    // Simple random solver for demo purposes
    // A real solver would use BFS/DFS to find the shortest path
    let currentTubes = [...tubes.map(t => [...t])];
    let steps = 0;
    
    while (steps < 100) {
      // Check win
      let won = true;
      let completed = 0;
      for (const t of currentTubes) {
        if (t.length > 0 && t.length < TUBE_CAPACITY) won = false;
        if (t.length === TUBE_CAPACITY && new Set(t).size === 1) completed++;
        if (t.length > 0 && new Set(t).size > 1) won = false;
      }
      if (won && completed === COLORS.length) break;

      // Find valid moves
      const validMoves: {from: number, to: number}[] = [];
      for (let i = 0; i < NUM_TUBES; i++) {
        if (currentTubes[i].length === 0) continue;
        const color = currentTubes[i][currentTubes[i].length - 1];
        
        for (let j = 0; j < NUM_TUBES; j++) {
          if (i === j) continue;
          if (currentTubes[j].length < TUBE_CAPACITY && 
             (currentTubes[j].length === 0 || currentTubes[j][currentTubes[j].length - 1] === color)) {
            validMoves.push({from: i, to: j});
          }
        }
      }

      if (validMoves.length === 0) break; // Stuck

      // Pick a random valid move
      const move = validMoves[Math.floor(Math.random() * validMoves.length)];
      
      const colorToMove = currentTubes[move.from].pop()!;
      currentTubes[move.to].push(colorToMove);
      
      setTubes([...currentTubes.map(t => [...t])]);
      setMoves(m => m + 1);
      await new Promise(r => setTimeout(r, 200));
      steps++;
    }

    setIsSolving(false);
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
          <div className="lg:col-span-2 flex justify-center items-center">
            <div className="glass-panel p-8 rounded-2xl inline-block relative w-full max-w-2xl">
              {isWon && !isSolving && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900/80 rounded-2xl backdrop-blur-sm">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-indigo-400 mb-2">Puzzle Solved!</h3>
                    <p className="text-gray-300">in {moves} moves</p>
                    <button onClick={generateLevel} className="mt-4 btn-primary mx-auto">Play Again</button>
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
                {tubes.map((tube, idx) => (
                  <div 
                    key={idx}
                    onClick={() => handleTubeClick(idx)}
                    className={`
                      relative w-12 sm:w-16 h-48 sm:h-64 border-4 border-t-0 rounded-b-full cursor-pointer transition-all duration-300
                      ${selectedTube === idx ? 'border-indigo-400 -translate-y-4 shadow-[0_10px_20px_rgba(99,102,241,0.3)]' : 'border-white/20 hover:border-white/40'}
                      bg-gray-800/50 flex flex-col-reverse p-1 overflow-hidden
                    `}
                  >
                    {/* Liquid/Balls */}
                    {tube.map((color, colorIdx) => (
                      <motion.div
                        key={`${idx}-${colorIdx}`}
                        layoutId={`color-${idx}-${colorIdx}`}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full h-1/4 rounded-full mb-1 shadow-inner"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Color Sorting</h2>
              <p className="text-gray-400">
                Sort the colors so that each tube contains only one color.
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
                disabled={isSolving || isWon}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <BrainCircuit className="w-5 h-5" />
                {isSolving ? 'AI is Solving...' : 'Solve with AI'}
              </button>
              
              <button 
                onClick={generateLevel}
                disabled={isSolving}
                className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className="w-5 h-5" />
                New Puzzle
              </button>
            </div>

            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-2">How to play</h3>
              <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
                <li>Click a tube to select the top color.</li>
                <li>Click another tube to move the color there.</li>
                <li>You can only move a color onto the same color or into an empty tube.</li>
                <li>Tubes hold a maximum of 4 colors.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
