import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Target } from 'lucide-react';
import { formatPrice, getRatingBadgeColor } from '../../services/investmentApi';

const StockCard = ({ stock, isSelected }) => {
  const getScorePercentage = () => {
    if (!stock.score || stock.score === 'N/A') return 0;
    const parts = stock.score.split('/');
    if (parts.length !== 2) return 0;
    const current = parseInt(parts[0]);
    const total = parseInt(parts[1]);
    return (current / total) * 100;
  };

  const scorePercentage = getScorePercentage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-2xl shadow-black/50"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white font-mono">{stock.symbol}</h3>
          <p className="text-sm text-slate-400 mt-1">{stock.name}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getRatingBadgeColor(stock.rating)}`}>
            {stock.rating}
          </span>
        </div>
      </div>

      {/* Score Progress Bar */}
      {stock.score && stock.score !== 'N/A' && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-slate-400 uppercase tracking-wider">Kỷ luật Indicator</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">{stock.score}</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${scorePercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
            />
          </div>
        </div>
      )}

      {/* 2-Column Layout: Metrics | Thesis */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Left Column: Metrics */}
        <div className="space-y-4">
          <h4 className="text-xs text-slate-400 uppercase tracking-wider font-bold">Chỉ số cơ bản</h4>
          
          {/* PE */}
          <div className="bg-slate-800/50 p-3 rounded-xl">
            <p className="text-xs text-slate-400 mb-1">PE Ratio</p>
            <p className="text-2xl font-bold text-white font-mono">
              {stock.pe > 0 ? stock.pe.toFixed(2) : '—'}
            </p>
          </div>

          {/* PEG */}
          <div className="bg-slate-800/50 p-3 rounded-xl">
            <p className="text-xs text-slate-400 mb-1">PEG Ratio</p>
            <p className="text-2xl font-bold text-white font-mono">
              {stock.peg > 0 ? stock.peg.toFixed(2) : '—'}
            </p>
          </div>

          {/* Debt Ratio */}
          <div className="bg-slate-800/50 p-3 rounded-xl">
            <p className="text-xs text-slate-400 mb-1">Nợ/VCSH</p>
            <p className="text-2xl font-bold text-white font-mono">
              {stock.debtRatio > 0 ? stock.debtRatio.toFixed(2) : '—'}
            </p>
          </div>
        </div>

        {/* Right Column: Thesis */}
        <div className="space-y-4">
          <h4 className="text-xs text-slate-400 uppercase tracking-wider font-bold">Investment Thesis</h4>
          
          {/* Story */}
          <div className="bg-slate-800/30 p-4 rounded-xl border border-slate-700/50">
            <div className="flex items-start gap-2 mb-2">
              <Target size={16} className="text-emerald-500 mt-1 flex-shrink-0" />
              <p className="text-xs text-slate-400 uppercase tracking-wider">Câu chuyện</p>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              {stock.story || 'Chưa có dữ liệu'}
            </p>
          </div>

          {/* Entry Condition */}
          <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/30">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-amber-400 uppercase tracking-wider mb-1">Điều kiện mua</p>
                <p className="text-sm text-amber-300">
                  {stock.entryCondition || 'Xem biểu đồ'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price Section */}
      <div className="pt-4 border-t border-slate-800">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-400 mb-1">Giá hiện tại (CafeF)</p>
            <p className="text-3xl font-bold text-emerald-400 font-mono">
              {formatPrice(stock.currentPrice)} ₫
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400 mb-1">Health Score</p>
            <p className={`text-2xl font-bold font-mono ${
              stock.healthScore >= 70 ? 'text-emerald-400' :
              stock.healthScore >= 50 ? 'text-blue-400' :
              stock.healthScore >= 30 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {stock.healthScore}/100
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StockCard;
