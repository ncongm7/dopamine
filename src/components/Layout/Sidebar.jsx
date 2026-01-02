import React from 'react';
import { Brain, Wallet, BookOpen, Settings, Activity, MessageSquare, TrendingUp } from 'lucide-react';

const Sidebar = ({ activeView, onViewChange }) => {
  return (
    <aside className="w-20 lg:w-64 bg-stoic-card border-r border-stoic-accent flex flex-col items-center lg:items-start py-8 transition-all duration-300">
      <div className="px-4 mb-12 flex items-center gap-3">
        <Activity className="w-8 h-8 text-stoic-safe" />
        <span className="hidden lg:block text-xl font-bold tracking-wider text-stoic-light">DOPAMINE</span>
      </div>

      <nav className="flex-1 w-full flex flex-col gap-4 px-2">
        <NavItem 
          icon={<Brain />} 
          label="Dashboard" 
          active={activeView === 'dashboard'}
          onClick={() => onViewChange('dashboard')}
        />
        <NavItem 
          icon={<Wallet />} 
          label="Finance" 
          active={activeView === 'finance'}
          onClick={() => onViewChange('finance')}
        />
        <NavItem 
          icon={<TrendingUp />} 
          label="Investment" 
          active={activeView === 'investment'}
          onClick={() => onViewChange('investment')}
        />
        <NavItem 
          icon={<MessageSquare />} 
          label="ChatGPT" 
          active={activeView === 'chatgpt'}
          onClick={() => onViewChange('chatgpt')}
        />
        <NavItem 
          icon={<BookOpen />} 
          label="Learning" 
          active={activeView === 'learning'}
          onClick={() => onViewChange('learning')}
        />
      </nav>

      <div className="w-full px-2 mt-auto">
        <NavItem 
          icon={<Settings />} 
          label="Settings" 
          active={activeView === 'settings'}
          onClick={() => onViewChange('settings')}
        />
      </div>
    </aside>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${active ? 'bg-stoic-accent text-stoic-light' : 'text-stoic-text hover:bg-stoic-bg hover:text-stoic-light'}`}
  >
    {React.cloneElement(icon, { size: 24 })}
    <span className="hidden lg:block font-medium">{label}</span>
  </button>
);

export default Sidebar;

