import React, { useState, useEffect } from 'react';
import { Shield, Skull } from 'lucide-react';
import { checkIn } from '../../services/api';

const CheckInWidget = ({ onCheckIn }) => {
  const [checkedIn, setCheckedIn] = useState(false);
  const [loading, setLoading] = useState(false);

  // In a real app, strict checking would be server-side or persisted in local storage
  // to prevent refresh-cheating. For now, we use component state.
  
  const handleCheckIn = async (status) => {
    if (checkedIn || loading) return;
    setLoading(true);
    
    try {
      await checkIn(status);
      setCheckedIn(true);
      onCheckIn(); // Trigger refresh of parent data
    } catch (error) {
      console.error("Check-in failed", error);
    } finally {
      setLoading(false);
    }
  };

  if (checkedIn) {
    return (
      <div className="bg-stoic-card p-6 rounded-2xl border border-stoic-safe/20 text-center animate-pulse-once">
        <p className="text-stoic-safe font-bold tracking-widest">PROTOCOL COMPLETE FOR TODAY</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <button 
        onClick={() => handleCheckIn('clean')}
        disabled={loading}
        className="group bg-stoic-card hover:bg-stoic-safe/10 border border-stoic-accent hover:border-stoic-safe p-6 rounded-2xl flex flex-col items-center transition-all duration-300"
      >
        <Shield className="w-8 h-8 text-stoic-text group-hover:text-stoic-safe mb-2 transition-colors" />
        <span className="text-stoic-text font-bold tracking-wider group-hover:text-white">MAINTAIN</span>
      </button>

      <button 
        onClick={() => handleCheckIn('relapse')}
        disabled={loading}
        className="group bg-stoic-card hover:bg-stoic-danger/10 border border-stoic-accent hover:border-stoic-danger p-6 rounded-2xl flex flex-col items-center transition-all duration-300"
      >
        <Skull className="w-8 h-8 text-stoic-text group-hover:text-stoic-danger mb-2 transition-colors" />
        <span className="text-stoic-text font-bold tracking-wider group-hover:text-white">RELAPSE</span>
      </button>
    </div>
  );
};

export default CheckInWidget;
