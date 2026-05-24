/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './components/LandingPage';
import SudokuGame from './games/SudokuGame';
import SlidingPuzzleGame from './games/SlidingPuzzleGame';
import MazeGame from './games/MazeGame';
import ColorSortGame from './games/ColorSortGame';

export type GameType = 'sudoku' | 'sliding' | 'maze' | 'color' | null;

export default function App() {
  const [currentGame, setCurrentGame] = useState<GameType>(null);

  const renderGame = () => {
    switch (currentGame) {
      case 'sudoku':
        return <SudokuGame onBack={() => setCurrentGame(null)} />;
      case 'sliding':
        return <SlidingPuzzleGame onBack={() => setCurrentGame(null)} />;
      case 'maze':
        return <MazeGame onBack={() => setCurrentGame(null)} />;
      case 'color':
        return <ColorSortGame onBack={() => setCurrentGame(null)} />;
      default:
        return <LandingPage onSelectGame={setCurrentGame} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-gray-200 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-800/10 blur-[120px]"></div>
      </div>

      <Navbar onHome={() => setCurrentGame(null)} />
      
      <main className="flex-grow z-10 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentGame || 'landing'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-grow flex flex-col"
          >
            {renderGame()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
