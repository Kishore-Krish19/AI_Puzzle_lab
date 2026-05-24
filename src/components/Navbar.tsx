import { BrainCircuit, Home, Gamepad2, Info } from 'lucide-react';

interface NavbarProps {
  onHome: () => void;
}

export default function Navbar({ onHome }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 glass-panel border-x-0 border-t-0 border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={onHome}
        >
          <div className="p-2 bg-indigo-500/20 rounded-xl group-hover:bg-indigo-500/30 transition-colors">
            <BrainCircuit className="w-6 h-6 text-indigo-400" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
            AI Puzzle Lab
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <button onClick={onHome} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>
          <button onClick={onHome} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
            <Gamepad2 className="w-4 h-4" />
            <span>Games</span>
          </button>
          <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
            <Info className="w-4 h-4" />
            <span>About</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
