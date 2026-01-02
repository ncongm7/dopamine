/**
 * INVESTMENT API SERVICE
 * Kết nối frontend với Google Apps Script backend (investment-code.gs)
 */

const INVESTMENT_API_URL = 'https://script.google.com/macros/s/AKfycbzA9r6XS5_0HhZDHgbNHqyxpebA7-Vqu25Wh2yDA8eNL1KXx7QFGZLr8pvuLR_GufZW/exec';

// Mock mode - TẮT để dùng dữ liệu thật từ Google Sheets
const USE_MOCK = false;

const MOCK_STOCKS = {
  status: 'success',
  data: [
    {
      symbol: 'PNJ',
      name: 'Vàng bạc PNJ',
      pe: 12.5,
      peg: 0.8,
      debtRatio: 0.3,
      score: '13/14',
      story: 'Kiếm tiền từ bán lẻ vàng bạc, mở rộng chuỗi cửa hàng',
      entryCondition: 'Mua nếu PE < 15',
      referencePrice: 95000,
      healthScore: 80,
      rating: 'BUY'
    },
    {
      symbol: 'FPT',
      name: 'FPT Corporation',
      pe: 18.2,
      peg: 1.2,
      debtRatio: 0.2,
      score: '12/14',
      story: 'Chuyển đổi số, Cloud computing, AI',
      entryCondition: 'Mua nếu PE < 20',
      referencePrice: 125000,
      healthScore: 70,
      rating: 'BUY'
    },
    {
      symbol: 'VSC',
      name: 'Container VSC',
      pe: 8.5,
      peg: 0.6,
      debtRatio: 0.4,
      score: '11/14',
      story: 'Logistics biển, container shipping',
      entryCondition: 'Mua nếu PE < 10',
      referencePrice: 45000,
      healthScore: 75,
      rating: 'BUY'
    },
    {
      symbol: 'DPM',
      name: 'Phân bón Dầu khí',
      pe: 10.2,
      peg: 0.9,
      debtRatio: 0.5,
      score: '10/14',
      story: 'Nông nghiệp, phân bón NPK',
      entryCondition: 'Mua nếu PE < 12',
      referencePrice: 38000,
      healthScore: 60,
      rating: 'ACCUMULATE'
    },
    {
      symbol: 'HAH',
      name: 'Thủy sản Hải Âu',
      pe: 7.8,
      peg: 0.5,
      debtRatio: 0.3,
      score: '9/14',
      story: 'Thủy sản xuất khẩu, tôm cá',
      entryCondition: 'Mua nếu PE < 9',
      referencePrice: 28000,
      healthScore: 65,
      rating: 'ACCUMULATE'
    }
  ],
  lastUpdate: new Date().toISOString(),
  count: 5
};

export const getStockAnalysis = async () => {
  if (USE_MOCK) {
    return new Promise(resolve => {
      setTimeout(() => resolve(MOCK_STOCKS), 300);
    });
  }

  try {
    const response = await fetch(`${INVESTMENT_API_URL}?action=get_stocks`);
    const result = await response.json();
    
    if (result.status === 'success') {
      return result;
    } else {
      throw new Error(result.message || 'Investment API error');
    }
  } catch (error) {
    console.error('Investment API Error:', error);
    throw error;
  }
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price);
};

export const getRatingColor = (rating) => {
  const colors = {
    'BUY': 'text-green-500',
    'ACCUMULATE': 'text-blue-500',
    'HOLD': 'text-yellow-500',
    'AVOID': 'text-red-500'
  };
  return colors[rating] || 'text-gray-500';
};

export const getRatingBadgeColor = (rating) => {
  const colors = {
    'BUY': 'bg-green-500/20 text-green-400 border-green-500/30',
    'ACCUMULATE': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'HOLD': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'AVOID': 'bg-red-500/20 text-red-400 border-red-500/30'
  };
  return colors[rating] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
};

/**
 * TEST FUNCTION
 */
export const testInvestmentAPI = async () => {
  console.log('🧪 Testing Investment API...\n');
  console.log('📍 Endpoint:', INVESTMENT_API_URL);
  console.log('🔄 Mock Mode:', USE_MOCK ? 'ON' : 'OFF');
  console.log('─'.repeat(50));

  try {
    console.log('⏳ Fetching stock analysis...');
    const data = await getStockAnalysis();
    
    console.log('✅ SUCCESS!\n');
    console.log('📊 Stocks:', data.count);
    console.log('🕒 Last Update:', new Date(data.lastUpdate).toLocaleString('vi-VN'));
    console.log('\n📈 Stock List:');
    data.data.forEach(stock => {
      console.log(`  ${stock.symbol} (${stock.name})`);
      console.log(`    PE: ${stock.pe} | PEG: ${stock.peg} | Rating: ${stock.rating}`);
    });
    
    return data;
  } catch (error) {
    console.error('❌ FAILED!');
    console.error('Error:', error.message);
    throw error;
  }
};
