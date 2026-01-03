import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, TrendingUp, Brain, DollarSign } from 'lucide-react';
import FreedomFund from './FreedomFund';
import UrgeCounter from './UrgeCounter';
import SmallVictoryFeed from './SmallVictoryFeed';
import EmergencyButton from './EmergencyButton';
import RecoveryMetrics from './RecoveryMetrics';
import { getGambleStats, checkInGamble } from '../../services/gambleApi';

const GambleRecovery = ({ onSwitchView }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check-in form state
  const [moneySaved, setMoneySaved] = useState('');
  const [smallWin, setSmallWin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getGambleStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError('Không thể tải dữ liệu phục hồi');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (e) => {
    e.preventDefault();
    
    if (!moneySaved || parseFloat(moneySaved) < 0) {
      alert('Vui lòng nhập số tiền hợp lệ');
      return;
    }

    try {
      setIsSubmitting(true);
      await checkInGamble(
        'clean',
        parseFloat(moneySaved),
        smallWin,
        0 // urge count will be tracked separately
      );
      
      // Show success animation
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
      
      // Reset form
      setMoneySaved('');
      setSmallWin('');
      
      // Reload stats
      await loadStats();
    } catch (err) {
      alert('Lỗi khi ghi nhận check-in. Vui lòng thử lại.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#0a1628]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Shield size={48} className="mx-auto mb-4 text-[#2d5f4f] animate-pulse" />
          <p className="text-slate-400">Đang tải dữ liệu phục hồi...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-[#0a1628]">
        <div className="text-center">
          <Shield size={48} className="mx-auto mb-4 text-red-500" />
          <p className="text-slate-400 mb-4">{error}</p>
          <button
            onClick={loadStats}
            className="px-6 py-3 bg-[#2d5f4f] text-white rounded-xl hover:bg-[#3d7f6f] transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6 bg-[#0a1628] p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Shield size={36} className="text-[#2d5f4f]" />
            Chiến Thắng Bản Thân
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Recovery from Gambling 
          </p>
        </div>
      </div>

      {/* Emergency Button - Always Visible */}
      <EmergencyButton 
        onUrgeRecorded={loadStats} 
        onSwitchToInvestment={() => onSwitchView && onSwitchView('investment')}
      />

      {/* Quick Check-In Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#2d5f4f]/10 to-[#0a1628] p-6 rounded-2xl border border-[#2d5f4f]/30 backdrop-blur-md"
      >
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <DollarSign size={24} className="text-[#2d5f4f]" />
          Hôm nay tôi đã cứu được bao nhiêu?
        </h2>
        
        <form onSubmit={handleCheckIn} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Số tiền định nướng nhưng đã giữ lại (VND)
            </label>
            <input
              type="number"
              value={moneySaved}
              onChange={(e) => setMoneySaved(e.target.value)}
              placeholder="500000"
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2d5f4f] transition-colors"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Việc nhỏ đã làm thay vì chơi (tùy chọn)
            </label>
            <input
              type="text"
              value={smallWin}
              onChange={(e) => setSmallWin(e.target.value)}
              placeholder="Đọc 5 trang sách, dọn nhà, tập thể dục..."
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2d5f4f] transition-colors"
              disabled={isSubmitting}
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-[#2d5f4f] to-[#3d7f6f] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#2d5f4f]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Đang ghi nhận...' : '✓ Tôi đã thắng chính mình'}
          </motion.button>
        </form>

        {/* Success Animation */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 p-3 bg-[#2d5f4f]/20 border border-[#2d5f4f] rounded-xl text-center"
            >
              <p className="text-[#2d5f4f] font-medium">✓ Ghi nhận thành công! Bạn đang chiến thắng.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Freedom Fund */}
        <FreedomFund 
          totalSaved={stats?.totalSaved || 0}
          gambleStreak={stats?.gambleStreak || 0}
        />

        {/* Urge Counter */}
        <UrgeCounter 
          todayUrges={stats?.urgeHistory?.[stats.urgeHistory.length - 1]?.count || 0}
          totalUrges={stats?.totalUrges || 0}
          onUrgeRecorded={loadStats}
        />
      </div>

      {/* Recovery Metrics Dashboard */}
      <RecoveryMetrics stats={stats} />

      {/* Small Victory Feed */}
      <SmallVictoryFeed victories={stats?.smallWins || []} />
    </div>
  );
};

export default GambleRecovery;
