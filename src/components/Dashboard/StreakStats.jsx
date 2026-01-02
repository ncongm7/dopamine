import React from 'react';

const StreakStats = ({ current, max }) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-stoic-card p-8 rounded-2xl flex flex-col items-center justify-center border border-stoic-accent">
        <span className="text-stoic-text text-sm uppercase tracking-widest mb-2">Current Streak</span>
        <span className="text-6xl font-bold text-white">{current}</span>
      </div>
      <div className="bg-stoic-card p-8 rounded-2xl flex flex-col items-center justify-center border border-stoic-accent opacity-75">
        <span className="text-stoic-text text-sm uppercase tracking-widest mb-2">Max Streak</span>
        <span className="text-6xl font-bold text-stoic-text">{max}</span>
      </div>
    </div>
  );
};

export default StreakStats;
