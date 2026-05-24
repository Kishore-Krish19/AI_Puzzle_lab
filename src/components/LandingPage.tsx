import { motion } from 'motion/react';
import { Gamepad2, Grid3X3, LayoutGrid, Route, TestTubeDiagonal } from 'lucide-react';
import { GameType } from '../App';

interface GameCardProps {
  id: GameType;
  title: string;
  description: string;
  icon: React.ReactNode;
  onSelect: (id: GameType) => void;
  delay: number;
}

function GameCard({ id, title, description, icon, onSelect, delay }: GameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="glass-panel p-6 rounded-2xl flex flex-col h-full cursor-pointer group relative overflow-hidden"
      onClick={() => onSelect(id)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-500"></div>
      
      <div className="w-14 h-14 rounded-xl bg-gray-700/50 flex items-center justify-center mb-6 text-indigo-400 group-hover:text-indigo-300 group-hover:bg-indigo-500/20 transition-all duration-300 shadow-lg">
        {icon}
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-200 transition-colors">{title}</h3>
      <p className="text-gray-400 flex-grow mb-8 leading-relaxed">
        {description}
      </p>
      
      <button className="btn-primary mt-auto w-full group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]">
        <Gamepad2 className="w-5 h-5" />
        Play Game
      </button>
    </motion.div>
  );
}

interface LandingPageProps {
  onSelectGame: (game: GameType) => void;
}

export default function LandingPage({ onSelectGame }: LandingPageProps) {
  const games = [
    {
      id: 'sudoku' as GameType,
      title: 'Sudoku Solver',
      description: 'Solve Sudoku puzzles or watch AI solve them instantly using backtracking algorithms.',
      icon: <Grid3X3 className="w-8 h-8" />
    },
    {
      id: 'sliding' as GameType,
      title: 'Sliding Puzzle',
      description: 'Rearrange the tiles to complete the 15-puzzle. AI can solve it optimally using A* search.',
      icon: <LayoutGrid className="w-8 h-8" />
    },
    {
      id: 'maze' as GameType,
      title: 'Maze Generator',
      description: 'A new maze is generated every time. Try solving it or let AI find the shortest path.',
      icon: <Route className="w-8 h-8" />
    },
    {
      id: 'color' as GameType,
      title: 'Color Sorting',
      description: 'Sort colors into tubes. Use logic to complete the puzzle or watch the AI solve it.',
      icon: <TestTubeDiagonal className="w-8 h-8" />
    }
  ];

  return (
    <div className="flex-grow flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-7xl w-full mx-auto">
        
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium tracking-wide">
            POWERED BY ALGORITHMS
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400 mb-6 tracking-tight">
            Play AI Powered <br className="hidden md:block" /> Puzzle Games
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Challenge yourself with classic puzzles, or sit back and watch intelligent algorithms solve them before your eyes.
          </p>
          <button 
            onClick={() => {
              const gamesSection = document.getElementById('games-grid');
              gamesSection?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn-primary text-lg px-8 py-4 mx-auto"
          >
            Start Playing
          </button>
        </motion.div>

        {/* Games Grid */}
        <div id="games-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
          {games.map((game, index) => (
            <GameCard
              key={game.id}
              {...game}
              onSelect={onSelectGame}
              delay={0.2 + index * 0.1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
