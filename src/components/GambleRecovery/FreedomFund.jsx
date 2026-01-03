import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp } from 'lucide-react';
import CountUp from 'react-countup';

const FreedomFund = ({ totalSaved, gambleStreak }) => {
  const [fptShares, setFptShares] = useState(0);
  const FPT_PRICE = 100000; // Approximate FPT stock price

  useEffect(() => {
    setFptShares(Math.floor(totalSaved / FPT_PRICE));
  }, [totalSaved]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-[#2d5f4f]/20 to-[#0a1628] p-6 rounded-2xl border border-[#2d5f4f]/30 backdrop-blur-md"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-[#2d5f4f]/20 rounded-xl">
          <DollarSign size={28} className="text-[#2d5f4f]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">The Freedom Fund</h3>
          <p className="text-xs text-slate-400">Quỹ Tự Do</p>
        </div>
      </div>

      {/* Main Counter */}
      <div className="mb-6">
        <div className="text-4xl font-bold text-white mb-2">
          <CountUp
            end={totalSaved}
            duration={2}
            separator="."
            suffix=" ₫"
          />
        </div>
        <p className="text-sm text-slate-400">
          Tổng số tiền đã cứu vãn được
        </p>
      </div>

      {/* Investment Equivalent */}
      <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 mb-1">Tương đương</p>
            <p className="text-2xl font-bold text-[#2d5f4f]">
              {fptShares} cổ phiếu
            </p>
            <p className="text-xs text-slate-500 mt-1">FPT (~100k/cp)</p>
          </div>
          <TrendingUp size={32} className="text-[#2d5f4f]/50" />
        </div>
      </div>

      {/* Streak Info */}
      {gambleStreak > 0 && (
        <div className="mt-4 p-3 bg-[#2d5f4f]/10 rounded-xl border border-[#2d5f4f]/20">
          <p className="text-sm text-slate-300 text-center">
            🔥 <span className="font-bold">{gambleStreak} ngày</span> không chơi
          </p>
        </div>
      )}

      {/* Motivational Note */}
      <div className="mt-4 text-xs text-slate-500 text-center italic">
        "Bạn đang trở thành nhà đầu tư, không phải con bạc"
      </div>
    </motion.div>
  );
};

export default FreedomFund;
