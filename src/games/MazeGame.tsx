import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, BrainCircuit, Play, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MazeGameProps {
  onBack: () => void;
}

type Cell = {
  x: number;
  y: number;
  walls: { top: boolean; right: boolean; bottom: boolean; left: boolean };
  visited: boolean;
};

const COLS = 20;
const ROWS = 20;
const CELL_SIZE = 20;

export default function MazeGame({ onBack }: MazeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [isSolving, setIsSolving] = useState(false);
  const [solvedPath, setSolvedPath] = useState<{x: number, y: number}[]>([]);
  const [hasWon, setHasWon] = useState(false);

  const generateMaze = useCallback(() => {
    // Initialize grid
    const grid: Cell[][] = [];
    for (let y = 0; y < ROWS; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < COLS; x++) {
        row.push({
          x,
          y,
          walls: { top: true, right: true, bottom: true, left: true },
          visited: false
        });
      }
      grid.push(row);
    }

    // Recursive backtracker
    const stack: Cell[] = [];
    let current = grid[0][0];
    current.visited = true;

    const getUnvisitedNeighbors = (cell: Cell) => {
      const neighbors: { cell: Cell; dir: string }[] = [];
      const { x, y } = cell;

      if (y > 0 && !grid[y - 1][x].visited) neighbors.push({ cell: grid[y - 1][x], dir: 'top' });
      if (x < COLS - 1 && !grid[y][x + 1].visited) neighbors.push({ cell: grid[y][x + 1], dir: 'right' });
      if (y < ROWS - 1 && !grid[y + 1][x].visited) neighbors.push({ cell: grid[y + 1][x], dir: 'bottom' });
      if (x > 0 && !grid[y][x - 1].visited) neighbors.push({ cell: grid[y][x - 1], dir: 'left' });

      return neighbors;
    };

    const removeWalls = (a: Cell, b: Cell, dir: string) => {
      if (dir === 'top') { a.walls.top = false; b.walls.bottom = false; }
      else if (dir === 'right') { a.walls.right = false; b.walls.left = false; }
      else if (dir === 'bottom') { a.walls.bottom = false; b.walls.top = false; }
      else if (dir === 'left') { a.walls.left = false; b.walls.right = false; }
    };

    let unvisitedCount = ROWS * COLS - 1;

    while (unvisitedCount > 0) {
      const neighbors = getUnvisitedNeighbors(current);
      if (neighbors.length > 0) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        stack.push(current);
        removeWalls(current, next.cell, next.dir);
        current = next.cell;
        current.visited = true;
        unvisitedCount--;
      } else if (stack.length > 0) {
        current = stack.pop()!;
      }
    }

    setMaze(grid);
    setPlayerPos({ x: 0, y: 0 });
    setSolvedPath([]);
    setIsSolving(false);
    setHasWon(false);
  }, []);

  useEffect(() => {
    generateMaze();
  }, [generateMaze]);

  const drawMaze = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || maze.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw cells
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const cell = maze[y][x];
        const px = x * CELL_SIZE;
        const py = y * CELL_SIZE;

        ctx.strokeStyle = '#6366f1'; // indigo-500
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';

        if (cell.walls.top) { ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + CELL_SIZE, py); ctx.stroke(); }
        if (cell.walls.right) { ctx.beginPath(); ctx.moveTo(px + CELL_SIZE, py); ctx.lineTo(px + CELL_SIZE, py + CELL_SIZE); ctx.stroke(); }
        if (cell.walls.bottom) { ctx.beginPath(); ctx.moveTo(px + CELL_SIZE, py + CELL_SIZE); ctx.lineTo(px, py + CELL_SIZE); ctx.stroke(); }
        if (cell.walls.left) { ctx.beginPath(); ctx.moveTo(px, py + CELL_SIZE); ctx.lineTo(px, py); ctx.stroke(); }
      }
    }

    // Draw solved path
    if (solvedPath.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = '#818cf8'; // indigo-400
      ctx.lineWidth = 4;
      ctx.moveTo(solvedPath[0].x * CELL_SIZE + CELL_SIZE / 2, solvedPath[0].y * CELL_SIZE + CELL_SIZE / 2);
      for (let i = 1; i < solvedPath.length; i++) {
        ctx.lineTo(solvedPath[i].x * CELL_SIZE + CELL_SIZE / 2, solvedPath[i].y * CELL_SIZE + CELL_SIZE / 2);
      }
      ctx.stroke();
    }

    // Draw goal
    ctx.fillStyle = '#10b981'; // emerald-500
    ctx.fillRect((COLS - 1) * CELL_SIZE + 4, (ROWS - 1) * CELL_SIZE + 4, CELL_SIZE - 8, CELL_SIZE - 8);

    // Draw player
    ctx.fillStyle = '#f43f5e'; // rose-500
    ctx.beginPath();
    ctx.arc(playerPos.x * CELL_SIZE + CELL_SIZE / 2, playerPos.y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 3, 0, Math.PI * 2);
    ctx.fill();

  }, [maze, playerPos, solvedPath]);

  useEffect(() => {
    drawMaze();
  }, [drawMaze]);

  useEffect(() => {
    if (playerPos.x === COLS - 1 && playerPos.y === ROWS - 1 && !hasWon) {
      setHasWon(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  }, [playerPos, hasWon]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isSolving || maze.length === 0) return;
    
    const { x, y } = playerPos;
    const cell = maze[y][x];
    
    let newX = x;
    let newY = y;

    if (e.key === 'ArrowUp' && !cell.walls.top) newY--;
    else if (e.key === 'ArrowRight' && !cell.walls.right) newX++;
    else if (e.key === 'ArrowDown' && !cell.walls.bottom) newY++;
    else if (e.key === 'ArrowLeft' && !cell.walls.left) newX--;

    if (newX !== x || newY !== y) {
      setPlayerPos({ x: newX, y: newY });
    }
  }, [playerPos, maze, isSolving]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const solveAI = async () => {
    if (isSolving || maze.length === 0) return;
    setIsSolving(true);
    setPlayerPos({ x: 0, y: 0 });
    setSolvedPath([]);

    // BFS to find shortest path
    const queue: { x: number, y: number, path: {x: number, y: number}[] }[] = [];
    const visited = new Set<string>();
    
    queue.push({ x: 0, y: 0, path: [{x: 0, y: 0}] });
    visited.add('0,0');

    let finalPath: {x: number, y: number}[] = [];

    while (queue.length > 0) {
      const current = queue.shift()!;
      const { x, y, path } = current;

      if (x === COLS - 1 && y === ROWS - 1) {
        finalPath = path;
        break;
      }

      const cell = maze[y][x];
      const neighbors = [];

      if (!cell.walls.top) neighbors.push({ x, y: y - 1 });
      if (!cell.walls.right) neighbors.push({ x: x + 1, y });
      if (!cell.walls.bottom) neighbors.push({ x, y: y + 1 });
      if (!cell.walls.left) neighbors.push({ x: x - 1, y });

      for (const n of neighbors) {
        const key = `${n.x},${n.y}`;
        if (!visited.has(key)) {
          visited.add(key);
          queue.push({ x: n.x, y: n.y, path: [...path, {x: n.x, y: n.y}] });
        }
      }
    }

    // Animate path
    const animatedPath: {x: number, y: number}[] = [];
    for (const step of finalPath) {
      animatedPath.push(step);
      setSolvedPath([...animatedPath]);
      setPlayerPos(step);
      await new Promise(r => setTimeout(r, 50));
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
            <div className="glass-panel p-6 rounded-2xl inline-block bg-gray-900 shadow-2xl relative">
              {hasWon && !isSolving && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900/80 rounded-2xl backdrop-blur-sm">
                  <div className="text-center">
                    <h3 className="text-3xl font-bold text-indigo-400 mb-2">Goal Reached!</h3>
                    <button onClick={generateMaze} className="mt-4 btn-primary mx-auto">Play Again</button>
                  </div>
                </div>
              )}
              <canvas
                ref={canvasRef}
                width={COLS * CELL_SIZE}
                height={ROWS * CELL_SIZE}
                className="bg-gray-800 rounded-lg shadow-inner"
                style={{ width: '100%', maxWidth: `${COLS * CELL_SIZE}px`, height: 'auto' }}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Maze Generator</h2>
              <p className="text-gray-400">
                Navigate from the top-left corner to the green goal at the bottom-right.
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
                onClick={generateMaze}
                disabled={isSolving}
                className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className="w-5 h-5" />
                Generate New Maze
              </button>
            </div>

            <div className="glass-panel p-6 rounded-2xl">
              <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-2">How to play</h3>
              <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
                <li>Use arrow keys to move the red dot.</li>
                <li>Reach the green square to win.</li>
                <li>Click "Solve with AI" to see the shortest path using BFS.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
