import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Calendar, Target } from 'lucide-react';
import { calculateRecoveryProgress, calculateDaysToRecovery } from '../../services/gambleApi';

const RecoveryMetrics = ({ stats }) => {
  const [totalLost, setTotalLost] = useState(null);
  const [recoveryProgress, setRecoveryProgress] = useState(null);
  const [daysToRecovery, setDaysToRecovery] = useState(null);

  useEffect(() => {
    // Load total lost from localStorage
    const stored = localStorage.getItem('gamble_total_lost');
    if (stored) {
      const amount = parseFloat(stored);
      setTotalLost(amount);
      
      if (stats) {
        const progress = calculateRecoveryProgress(amount, stats.totalSaved);
        setRecoveryProgress(progress);
        
        const days = calculateDaysToRecovery(amount, stats.totalSaved, stats.gambleStreak);
        setDaysToRecovery(days);
      }
    }
  }, [stats]);

  if (!stats) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#2d5f4f]/10 to-[#0a1628] p-6 rounded-2xl border border-[#2d5f4f]/30 backdrop-blur-md"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-[#2d5f4f]/20 rounded-xl">
          <BarChart3 size={24} className="text-[#2d5f4f]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Recovery Analytics</h3>
          <p className="text-xs text-slate-400">Phân tích phục hồi</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Streak */}
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-[#2d5f4f]" />
            <p className="text-xs text-slate-400">Chuỗi ngày sạch</p>
          </div>
          <p className="text-3xl font-bold text-white">{stats.gambleStreak}</p>
          <p className="text-xs text-slate-500 mt-1">ngày</p>
        </div>

        {/* Total Saved */}
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-[#2d5f4f]" />
            <p className="text-xs text-slate-400">Tổng tiền cứu vãn</p>
          </div>
          <p className="text-3xl font-bold text-white">
            {(stats.totalSaved / 1000000).toFixed(1)}M
          </p>
          <p className="text-xs text-slate-500 mt-1">VND</p>
        </div>

        {/* Urges Resisted */}
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-[#2d5f4f]" />
            <p className="text-xs text-slate-400">Urges thắng</p>
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalUrges}</p>
          <p className="text-xs text-slate-500 mt-1">lần</p>
        </div>
      </div>

      {/* Recovery Progress Bar */}
      {recoveryProgress && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-slate-400">Tiến độ phục hồi tài chính</p>
            <p className="text-sm font-bold text-[#2d5f4f]">
              {recoveryProgress.percentage.toFixed(1)}%
            </p>
          </div>
          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(recoveryProgress.percentage, 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-[#2d5f4f] to-[#3d7f6f]"
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Còn {(recoveryProgress.remaining / 1000000).toFixed(1)}M VND để về bờ
          </p>
        </div>
      )}

      {/* Days to Recovery */}
      {daysToRecovery !== null && daysToRecovery > 0 && (
        <div className="p-4 bg-gradient-to-r from-[#2d5f4f]/20 to-[#3d7f6f]/20 border border-[#2d5f4f]/30 rounded-xl mb-6">
          <p className="text-sm text-slate-400 mb-1">Thời gian hồi phục dự kiến</p>
          <p className="text-2xl font-bold text-white">
            {daysToRecovery} ngày nữa
          </p>
          <p className="text-xs text-slate-500 mt-1">
            (Dựa trên tốc độ tiết kiệm hiện tại: {(stats.totalSaved / stats.gambleStreak / 1000).toFixed(0)}k/ngày)
          </p>
        </div>
      )}

      {/* Max Streak */}
      {stats.maxStreak > stats.gambleStreak && (
        <div className="p-4 bg-slate-900/30 rounded-xl border border-slate-700">
          <p className="text-xs text-slate-400 mb-1">Kỷ lục cá nhân</p>
          <p className="text-xl font-bold text-slate-300">
            {stats.maxStreak} ngày
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Bạn đã làm được rồi, hãy vượt qua nó!
          </p>
        </div>
      )}

      {/* Motivational Note */}
      <div className="mt-6 text-xs text-slate-500 text-center italic">
        "Mỗi ngày là một bước tiến về phía tự do tài chính"
      </div>
    </motion.div>
  );
};

export default RecoveryMetrics;
