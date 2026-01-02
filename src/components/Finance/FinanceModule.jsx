import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, AlertCircle, Eye, EyeOff, Activity, X, Calendar } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getFinanceStats, formatCurrency, truncateText } from '../../services/financeApi';

const FinanceModule = ({ cachedData, onDataLoaded }) => {
  const [stats, setStats] = useState(cachedData); // Initialize with cached data
  const [loading, setLoading] = useState(!cachedData); // Skip loading if cached
  const [error, setError] = useState(null);
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [expandedTransaction, setExpandedTransaction] = useState(null);
  
  // Filter states - Always visible
  const [filters, setFilters] = useState({
    dateRange: 'all', // all, today, week, month, custom
    customStartDate: '',
    customEndDate: '',
    bank: 'all',
    category: 'all',
    searchText: ''
  });

  useEffect(() => {
    // Only load if no cached data
    if (!cachedData) {
      loadFinanceData();
    }
  }, []); // Only run once on mount

  const loadFinanceData = async () => {
    try {
      setLoading(true);
      const data = await getFinanceStats();
      setStats(data);
      onDataLoaded(data); // Cache in parent
      setError(null);
    } catch (err) {
      setError('Không thể tải dữ liệu tài chính');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isImpulseTransaction = (transactionId) => {
    return stats?.impulseTransactions?.includes(transactionId);
  };

  const getImpulseWarning = () => {
    const filteredCount = getFilteredTransactions().length;
    if (filteredCount > 5) {
      return 'Cảnh báo: Dopamine mua sắm cao';
    }
    return null;
  };

  // Calculate summary from filtered transactions
  const getFilteredSummary = () => {
    const filtered = getFilteredTransactions();
    const total = filtered.reduce((sum, tx) => sum + tx.amount, 0);
    const count = filtered.length;
    return { total, count };
  };

  // Get unique banks for filter
  const getUniqueBanks = () => {
    if (!stats?.transactions) return [];
    return [...new Set(stats.transactions.map(t => t.bank))].filter(Boolean);
  };

  // Filter transactions
  const getFilteredTransactions = () => {
    if (!stats?.transactions) return [];
    
    return stats.transactions.filter(tx => {
      const txDate = new Date(tx.timestamp);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      // Date range filter
      if (filters.dateRange === 'today' && txDate < today) return false;
      
      if (filters.dateRange === 'yesterday') {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const dayAfterYesterday = new Date(yesterday);
        dayAfterYesterday.setDate(dayAfterYesterday.getDate() + 1);
        if (txDate < yesterday || txDate >= dayAfterYesterday) return false;
      }
      
      if (filters.dateRange === 'week') {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        if (txDate < weekAgo) return false;
      }
      
      if (filters.dateRange === 'month') {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        if (txDate < monthAgo) return false;
      }
      
      if (filters.dateRange === 'thisMonth') {
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        if (txDate < firstDayOfMonth) return false;
      }
      
      if (filters.dateRange === 'lastMonth') {
        const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const firstDayOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        if (txDate < firstDayOfLastMonth || txDate >= firstDayOfThisMonth) return false;
      }
      
      if (filters.dateRange === 'custom') {
        if (filters.customStartDate) {
          const startDate = new Date(filters.customStartDate);
          if (txDate < startDate) return false;
        }
        if (filters.customEndDate) {
          const endDate = new Date(filters.customEndDate);
          endDate.setHours(23, 59, 59);
          if (txDate > endDate) return false;
        }
      }
      
      // Bank filter
      if (filters.bank !== 'all' && tx.bank !== filters.bank) return false;
      
      // Category filter
      if (filters.category !== 'all' && tx.category !== filters.category) return false;
      
      // Search text filter
      if (filters.searchText && !tx.description.toLowerCase().includes(filters.searchText.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  };

  // Filter chart data based on filtered transactions
  const getFilteredChartData = () => {
    const filteredTxs = getFilteredTransactions();
    if (filteredTxs.length === 0) return [];

    // Group by date
    const grouped = {};
    filteredTxs.forEach(tx => {
      const date = new Date(tx.timestamp);
      const dateKey = `${date.getDate()}/${date.getMonth() + 1}`;
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = { date: dateKey, amount: 0, count: 0 };
      }
      grouped[dateKey].amount += tx.amount;
      grouped[dateKey].count += 1;
    });

    return Object.values(grouped).sort((a, b) => {
      const [dayA, monthA] = a.date.split('/').map(Number);
      const [dayB, monthB] = b.date.split('/').map(Number);
      return monthA === monthB ? dayA - dayB : monthA - monthB;
    });
  };

  const resetFilters = () => {
    setFilters({
      dateRange: 'all',
      customStartDate: '',
      customEndDate: '',
      bank: 'all',
      category: 'all',
      searchText: ''
    });
  };

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Activity size={48} className="mx-auto mb-4 text-stoic-safe animate-pulse" />
          <p className="text-stoic-text">Đang tải dữ liệu tài chính...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
          <p className="text-stoic-text mb-4">{error}</p>
          <button
            onClick={loadFinanceData}
            className="px-4 py-2 bg-stoic-safe text-white rounded-lg hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <DollarSign size={32} className="text-stoic-safe" />
          Finance Tracker
        </h1>
        <button
          onClick={loadFinanceData}
          className="p-2 rounded-lg bg-stoic-card hover:bg-stoic-bg text-stoic-text hover:text-white border border-stoic-accent"
        >
          Làm mới
        </button>
      </div>

      {/* Filter Panel - Always Visible at Top */}
      <div className="bg-stoic-card p-5 rounded-2xl border border-stoic-accent">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-stoic-text uppercase tracking-wider">Bộ lọc</h3>
          <button
            onClick={resetFilters}
            className="text-xs text-stoic-safe hover:text-blue-400 flex items-center gap-1"
          >
            <X size={14} />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Date Range */}
          <div>
            <label className="text-xs text-stoic-text mb-1.5 block">Thời gian</label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
              className="w-full px-3 py-2 rounded-lg bg-stoic-bg border border-stoic-accent text-stoic-light text-sm focus:outline-none focus:border-stoic-safe"
            >
              <option value="all">Tất cả</option>
              <option value="today">Hôm nay</option>
              <option value="yesterday">Hôm qua</option>
              <option value="week">7 ngày</option>
              <option value="month">30 ngày</option>
              <option value="thisMonth">Tháng này</option>
              <option value="lastMonth">Tháng trước</option>
              <option value="custom">Tùy chỉnh</option>
            </select>
          </div>

          {/* Custom Date Range */}
          {filters.dateRange === 'custom' && (
            <>
              <div>
                <label className="text-xs text-stoic-text mb-1.5 block flex items-center gap-1">
                  <Calendar size={12} />
                  Từ ngày
                </label>
                <input
                  type="date"
                  value={filters.customStartDate}
                  onChange={(e) => setFilters({...filters, customStartDate: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg bg-stoic-bg border border-stoic-accent text-stoic-light text-sm focus:outline-none focus:border-stoic-safe"
                />
              </div>
              <div>
                <label className="text-xs text-stoic-text mb-1.5 block flex items-center gap-1">
                  <Calendar size={12} />
                  Đến ngày
                </label>
                <input
                  type="date"
                  value={filters.customEndDate}
                  onChange={(e) => setFilters({...filters, customEndDate: e.target.value})}
                  className="w-full px-3 py-2 rounded-lg bg-stoic-bg border border-stoic-accent text-stoic-light text-sm focus:outline-none focus:border-stoic-safe"
                />
              </div>
            </>
          )}

          {/* Bank */}
          <div>
            <label className="text-xs text-stoic-text mb-1.5 block">Ngân hàng</label>
            <select
              value={filters.bank}
              onChange={(e) => setFilters({...filters, bank: e.target.value})}
              className="w-full px-3 py-2 rounded-lg bg-stoic-bg border border-stoic-accent text-stoic-light text-sm focus:outline-none focus:border-stoic-safe"
            >
              <option value="all">Tất cả</option>
              {getUniqueBanks().map(bank => (
                <option key={bank} value={bank}>{bank}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="text-xs text-stoic-text mb-1.5 block">Loại</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="w-full px-3 py-2 rounded-lg bg-stoic-bg border border-stoic-accent text-stoic-light text-sm focus:outline-none focus:border-stoic-safe"
            >
              <option value="all">Tất cả</option>
              <option value="Micro">Micro (&lt; 50k)</option>
              <option value="Medium">Medium (50k-500k)</option>
              <option value="High">High (&gt; 500k)</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="text-xs text-stoic-text mb-1.5 block">Tìm kiếm</label>
            <input
              type="text"
              placeholder="Nội dung giao dịch..."
              value={filters.searchText}
              onChange={(e) => setFilters({...filters, searchText: e.target.value})}
              className="w-full px-3 py-2 rounded-lg bg-stoic-bg border border-stoic-accent text-stoic-light text-sm placeholder-stoic-text focus:outline-none focus:border-stoic-safe"
            />
          </div>
        </div>

        {/* Filter Result Count */}
        {(filters.dateRange !== 'all' || filters.bank !== 'all' || filters.category !== 'all' || filters.searchText) && (
          <div className="mt-3 pt-3 border-t border-stoic-accent">
            <p className="text-xs text-stoic-safe">
              Hiển thị <span className="font-bold">{getFilteredTransactions().length}</span> / {stats?.transactions?.length || 0} giao dịch
            </p>
          </div>
        )}
      </div>

      {/* Summary Cards - Based on Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Filtered Total Spending */}
        <div className="bg-stoic-card p-6 rounded-2xl border border-stoic-accent">
          <p className="text-xs uppercase tracking-wider text-stoic-text mb-2">
            {filters.dateRange === 'all' ? 'Tổng chi tiêu' :
             filters.dateRange === 'today' ? 'Tổng chi hôm nay' :
             filters.dateRange === 'yesterday' ? 'Tổng chi hôm qua' :
             filters.dateRange === 'week' ? 'Tổng chi 7 ngày' :
             filters.dateRange === 'month' ? 'Tổng chi 30 ngày' :
             filters.dateRange === 'thisMonth' ? 'Tổng chi tháng này' :
             filters.dateRange === 'lastMonth' ? 'Tổng chi tháng trước' :
             'Tổng chi tiêu'}
          </p>
          <p className="text-3xl font-bold text-white mb-1">
            {formatCurrency(getFilteredSummary().total)}
          </p>
          <p className="text-sm text-stoic-text">
            {getFilteredSummary().count} giao dịch
          </p>
        </div>

        {/* Impulse Index */}
        <div className="bg-stoic-card p-6 rounded-2xl border border-stoic-accent">
          <p className="text-xs uppercase tracking-wider text-stoic-text mb-2">Chỉ số xung động</p>
          <p className="text-3xl font-bold text-white mb-1">{getFilteredSummary().count}</p>
          {getImpulseWarning() && (
            <div className="flex items-center gap-2 text-yellow-500 text-sm mt-2">
              <AlertCircle size={16} />
              <span>{getImpulseWarning()}</span>
            </div>
          )}
        </div>

        {/* Total Spending (All Time) */}
        <div className="bg-stoic-card p-6 rounded-2xl border border-stoic-accent">
          <p className="text-xs uppercase tracking-wider text-stoic-text mb-2">Tổng chi tiêu (Tất cả)</p>
          <p className="text-3xl font-bold text-white">
            {formatCurrency(stats?.transactions?.reduce((sum, tx) => sum + tx.amount, 0) || 0)}
          </p>
          <p className="text-xs text-stoic-text mt-1">
            {stats?.transactions?.length || 0} giao dịch
          </p>
        </div>
      </div>

      {/* Charts - Using Filtered Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Spending Trend */}
        <div className="bg-stoic-card p-6 rounded-2xl border border-stoic-accent">
          <h3 className="text-sm font-bold text-stoic-text uppercase tracking-wider mb-4">
            Xu hướng chi tiêu
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={getFilteredChartData()}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#cbd5e1' }}
              />
              <Area type="monotone" dataKey="amount" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAmount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Transaction Frequency */}
        <div className="bg-stoic-card p-6 rounded-2xl border border-stoic-accent">
          <h3 className="text-sm font-bold text-stoic-text uppercase tracking-wider mb-4">
            Tần suất giao dịch
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={getFilteredChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                labelStyle={{ color: '#cbd5e1' }}
              />
              <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-stoic-card p-6 rounded-2xl border border-stoic-accent">
        <h3 className="text-sm font-bold text-stoic-text uppercase tracking-wider mb-4 flex items-center gap-2">
          <TrendingUp size={16} />
          Giao dịch gần đây
        </h3>

        <div className="space-y-2">
          {getFilteredTransactions().slice(0, 20).map((tx) => (
            <div
              key={tx.id}
              className={`p-4 rounded-xl border transition-colors cursor-pointer ${
                isImpulseTransaction(tx.id)
                  ? 'bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20'
                  : 'bg-stoic-bg/50 border-stoic-accent hover:bg-stoic-bg'
              }`}
              onClick={() => setExpandedTransaction(expandedTransaction === tx.id ? null : tx.id)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded bg-stoic-bg text-stoic-text uppercase">
                      {tx.bank}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      tx.category === 'High' ? 'bg-red-500/20 text-red-400' :
                      tx.category === 'Medium' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {tx.category}
                    </span>
                    {isImpulseTransaction(tx.id) && (
                      <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-500 flex items-center gap-1">
                        <AlertCircle size={12} />
                        Bốc đồng
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-stoic-light">
                    {expandedTransaction === tx.id ? tx.description : truncateText(tx.description, 60)}
                  </p>
                  <p className="text-xs text-stoic-text mt-1">
                    {new Date(tx.timestamp).toLocaleString('vi-VN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">{formatCurrency(tx.amount)}</p>
                  <p className="text-xs text-stoic-text">Số dư: {formatCurrency(tx.balance)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinanceModule;
