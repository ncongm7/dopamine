import React from 'react';
import Sidebar from './Sidebar';

const AppLayout = ({ children, activeView, onViewChange }) => {
  return (
    <div className="flex h-screen w-full bg-stoic-bg text-stoic-text overflow-hidden">
      <Sidebar activeView={activeView} onViewChange={onViewChange} />
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
            {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;

