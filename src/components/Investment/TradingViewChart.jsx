import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, TrendingUp, BarChart3 } from 'lucide-react';

const TradingViewChart = ({ symbol }) => {
  const openSSIChart = () => {
    const ssiUrl = `https://iboard.ssi.com.vn/bang-gia/chart?symbol=${symbol}`;
    window.open(ssiUrl, '_blank', 'width=1200,height=800');
  };

  const openCafeFChart = () => {
    const cafefUrl = `https://s.cafef.vn/screener/chart.aspx?symbol=${symbol}`;
    window.open(cafefUrl, '_blank', 'width=1200,height=800');
  };

  return (
    <motion.div
      key={symbol}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full bg-slate-900/50 rounded-2xl border border-slate-800 backdrop-blur-md shadow-2xl shadow-black/50 flex items-center justify-center p-8"
    >
      <div className="text-center max-w-2xl">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-6 bg-emerald-500/10 rounded-full border-2 border-emerald-500/30">
            <BarChart3 size={64} className="text-emerald-500" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-2xl font-bold text-white mb-2">
          Biểu đồ {symbol}
        </h3>
        <p className="text-slate-400 mb-8">
          Do hạn chế bảo mật, biểu đồ sẽ mở trong cửa sổ riêng
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          {/* SSI iBoard */}
          <button
            onClick={openSSIChart}
            className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl transition-all flex items-center justify-center gap-3 font-medium shadow-lg shadow-emerald-500/20"
          >
            <TrendingUp size={20} />
            Mở biểu đồ SSI iBoard
            <ExternalLink size={16} />
          </button>

          {/* CafeF */}
          <button
            onClick={openCafeFChart}
            className="w-full px-6 py-4 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white border border-slate-700 rounded-xl transition-all flex items-center justify-center gap-3 font-medium"
          >
            <BarChart3 size={20} />
            Mở biểu đồ CafeF
            <ExternalLink size={16} />
          </button>
        </div>

        {/* Note */}
        <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
          <p className="text-sm text-amber-400">
            💡 <span className="font-bold">Lưu ý:</span> Các trang SSI và CafeF không cho phép nhúng iframe do chính sách bảo mật. 
            Biểu đồ sẽ mở trong cửa sổ popup riêng để bạn theo dõi.
          </p>
        </div>

        {/* Quick Links */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-500">
          <a
            href={`https://iboard.ssi.com.vn/bang-gia/chart?symbol=${symbol}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-400 transition-colors flex items-center gap-1"
          >
            SSI iBoard <ExternalLink size={10} />
          </a>
          <span>•</span>
          <a
            href={`https://s.cafef.vn/screener/chart.aspx?symbol=${symbol}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-400 transition-colors flex items-center gap-1"
          >
            CafeF Chart <ExternalLink size={10} />
          </a>
          <span>•</span>
          <a
            href={`https://www.vndirect.com.vn/portal/thong-tin-co-phieu/${symbol}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-400 transition-colors flex items-center gap-1"
          >
            VNDirect <ExternalLink size={10} />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default TradingViewChart;
