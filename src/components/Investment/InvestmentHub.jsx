import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, RefreshCw, Activity, Clock } from 'lucide-react';
import TradingViewChart from './TradingViewChart';
import StockCard from './StockCard';
import MentalCheck from './MentalCheck';
import { getStockAnalysis, formatPrice } from '../../services/investmentApi';

const InvestmentHub = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMentalCheck, setShowMentalCheck] = useState(false);
  const [marketStatus, setMarketStatus] = useState('CLOSED');

  useEffect(() => {
    // Check Mental Check status
    const checkStatus = localStorage.getItem('investment_mental_check');
    const checkTime = localStorage.getItem('investment_mental_check_time');
    
    if (checkStatus === 'passed' && checkTime) {
      const hoursPassed = (Date.now() - parseInt(checkTime)) / (1000 * 60 * 60);
      if (hoursPassed < 24) {
        loadStocks();
      } else {
        setShowMentalCheck(true);
      }
    } else {
      setShowMentalCheck(true);
    }

    // Check market status
    updateMarketStatus();
    const statusInterval = setInterval(updateMarketStatus, 60000); // Update every minute
    
    return () => clearInterval(statusInterval);
  }, []);

  const updateMarketStatus = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const day = now.getDay();
    
    // HOSE: 9:00-11:30, 13:00-15:00, Mon-Fri
    const isWeekday = day >= 1 && day <= 5;
    const isMorningSession = (hours === 9 || (hours === 10) || (hours === 11 && minutes <= 30));
    const isAfternoonSession = (hours === 13 || hours === 14 || (hours === 15 && minutes === 0));
    
    if (isWeekday && (isMorningSession || isAfternoonSession)) {
      setMarketStatus('OPEN');
    } else {
      setMarketStatus('CLOSED');
    }
  };

  const loadStocks = async () => {
    try {
      setLoading(true);
      const data = await getStockAnalysis();
      setStocks(data.data);
      if (data.data.length > 0) {
        setSelectedStock(data.data[0].symbol);
      }
      setError(null);
    } catch (err) {
      setError('Không thể tải dữ liệu phân tích');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMentalCheckPass = () => {
    localStorage.setItem('investment_mental_check', 'passed');
    localStorage.setItem('investment_mental_check_time', Date.now().toString());
    setShowMentalCheck(false);
    loadStocks();
  };

  const handleMentalCheckFail = () => {
    window.history.back();
  };

  if (showMentalCheck) {
    return <MentalCheck onPass={handleMentalCheckPass} onFail={handleMentalCheckFail} />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#0a0c10]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Activity size={48} className="mx-auto mb-4 text-emerald-500 animate-pulse" />
          <p className="text-slate-400">Đang tải dữ liệu thị trường...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-[#0a0c10]">
        <div className="text-center">
          <TrendingUp size={48} className="mx-auto mb-4 text-red-500" />
          <p className="text-slate-400 mb-4">{error}</p>
          <button
            onClick={loadStocks}
            className="px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const selectedStockData = stocks.find(s => s.symbol === selectedStock);

  return (
    <div className="h-full flex flex-col space-y-6 bg-[#0a0c10] p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <TrendingUp size={36} className="text-emerald-500" />
            Investment Hub
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Smart Money Focus - 5 mã chiến lược
          </p>
        </div>
        <div className="flex items-center gap-4">
          {/* Market Status */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-md border ${
            marketStatus === 'OPEN' 
              ? 'bg-emerald-500/10 border-emerald-500/30' 
              : 'bg-slate-800/50 border-slate-700'
          }`}>
            <Clock size={16} className={marketStatus === 'OPEN' ? 'text-emerald-500' : 'text-slate-400'} />
            <span className={`text-sm font-medium ${marketStatus === 'OPEN' ? 'text-emerald-400' : 'text-slate-400'}`}>
              {marketStatus === 'OPEN' ? 'Thị trường Mở' : 'Thị trường Đóng'}
            </span>
          </div>
          
          <button
            onClick={loadStocks}
            className="p-3 rounded-xl bg-slate-900/50 hover:bg-slate-800/50 text-slate-400 hover:text-white border border-slate-800 backdrop-blur-md transition-colors"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Stock Selector Chips */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {stocks.map(stock => (
          <motion.button
            key={stock.symbol}
            onClick={() => setSelectedStock(stock.symbol)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-6 py-4 rounded-2xl whitespace-nowrap transition-all backdrop-blur-md ${
              selectedStock === stock.symbol
                ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border-2 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-slate-900/50 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex flex-col items-start">
              <span className="font-bold text-lg font-mono">{stock.symbol}</span>
              <span className="text-xs opacity-75 mt-1">
                {formatPrice(stock.currentPrice)} ₫
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedStock}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0"
        >
          {/* Left: Stock Analysis Card */}
          <div className="lg:col-span-1 overflow-y-auto space-y-4">
            {selectedStockData && (
              <StockCard
                stock={selectedStockData}
                isSelected={true}
              />
            )}
          </div>

          {/* Right: TradingView Chart */}
          <div className="lg:col-span-2 min-h-[600px]">
            <TradingViewChart symbol={selectedStock} />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Footer Note */}
      <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 backdrop-blur-md">
        <p className="text-xs text-slate-400">
          💡 <span className="font-bold">Lưu ý:</span> Giá realtime hiển thị trên biểu đồ TradingView. 
          Dữ liệu phân tích (PE, PEG, Score) được cập nhật từ Google Sheets.
        </p>
      </div>
    </div>
  );
};

export default InvestmentHub;
