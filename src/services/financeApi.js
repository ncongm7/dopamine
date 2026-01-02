/**
 * FINANCE API SERVICE
 * Kết nối frontend với Google Apps Script backend (finance-code.gs)
 */

// Finance API endpoint (cần update sau khi deploy Apps Script)
const FINANCE_API_URL = 'https://script.google.com/macros/s/AKfycbwB7SopGJvtTF6Tz5aWmrIPMB81PFOdOkZ8uCD9Cg_brEFQpq40HB-ZPUaOe-Um174/exec';

// Mock mode for development
const USE_MOCK = false;

const MOCK_FINANCE_DATA = {
  summary: {
    todayTotal: 250000,
    yesterdayTotal: 180000,
    last7DaysTotal: 1450000,
    todayCount: 7
  },
  transactions: [
    {
      id: 1,
      timestamp: new Date().toISOString(),
      bank: 'VIB',
      amount: 50000,
      type: 'Chi tiêu',
      description: 'NGUYEN VAN CONG chuyen tien den NGUYEN THI THUY HUONG - MBTSW250327673',
      balance: 9252100,
      category: 'Medium'
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      bank: 'VIB',
      amount: 200000,
      type: 'Chi tiêu',
      description: 'NGUYEN VAN CONG - 1014497143',
      balance: 9302100,
      category: 'Medium'
    }
  ],
  chartData: [
    { date: '26/12', amount: 350000, count: 5 },
    { date: '27/12', amount: 200000, count: 3 },
    { date: '28/12', amount: 450000, count: 8 },
    { date: '29/12', amount: 180000, count: 4 },
    { date: '30/12', amount: 270000, count: 6 },
    { date: '31/12', amount: 0, count: 0 },
    { date: '01/01', amount: 250000, count: 7 }
  ],
  currentBalance: 9252100,
  impulseTransactions: [1, 2, 3]
};

export const getFinanceStats = async () => {
  if (USE_MOCK) {
    return new Promise(resolve => {
      setTimeout(() => resolve(MOCK_FINANCE_DATA), 500);
    });
  }

  try {
    const response = await fetch(`${FINANCE_API_URL}?action=get_finance_stats`);
    const result = await response.json();
    
    if (result.status === 'success') {
      return result.data;
    } else {
      throw new Error(result.message || 'Finance API error');
    }
  } catch (error) {
    console.error('Finance API Error:', error);
    throw error;
  }
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export const truncateText = (text, maxLength = 25) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * TEST FUNCTION - Dùng trong console để test kết nối Finance API
 * Usage: window.testFinanceAPI()
 */
export const testFinanceAPI = async () => {
  console.log('🧪 Testing Finance API Connection...\n');
  console.log('📍 Endpoint:', FINANCE_API_URL);
  console.log('🔄 Mock Mode:', USE_MOCK ? 'ON (using mock data)' : 'OFF (using real API)');
  console.log('─'.repeat(50));

  if (FINANCE_API_URL === 'YOUR_FINANCE_APPS_SCRIPT_URL_HERE') {
    console.error('❌ CHƯA CẤU HÌNH API URL!');
    console.log('\n📝 Hướng dẫn:');
    console.log('1. Deploy backend/finance-code.gs vào Google Sheet "Chi tiêu"');
    console.log('2. Copy URL từ Apps Script deployment');
    console.log('3. Paste vào src/services/financeApi.js (FINANCE_API_URL)');
    return;
  }

  try {
    console.log('⏳ Đang gọi API...');
    const data = await getFinanceStats();
    
    console.log('✅ KẾT NỐI THÀNH CÔNG!\n');
    console.log('📊 Summary:');
    console.log('  - Tổng chi hôm nay:', formatCurrency(data.summary.todayTotal));
    console.log('  - Số giao dịch hôm nay:', data.summary.todayCount);
    console.log('  - Tổng chi 7 ngày:', formatCurrency(data.summary.last7DaysTotal));
    console.log('  - Số dư hiện tại:', formatCurrency(data.currentBalance));
    console.log('\n📝 Transactions:', data.transactions?.length || 0, 'giao dịch');
    console.log('📈 Chart Data:', data.chartData?.length || 0, 'data points');
    console.log('⚠️  Impulse Transactions:', data.impulseTransactions?.length || 0);
    
    console.log('\n✨ Finance Module sẵn sàng hoạt động!');
    return data;
  } catch (error) {
    console.error('❌ KẾT NỐI THẤT BẠI!');
    console.error('Error:', error.message);
    console.log('\n🔍 Kiểm tra:');
    console.log('  1. URL Apps Script có đúng không?');
    console.log('  2. Sheet "Chi tiêu" có tồn tại không?');
    console.log('  3. Deployment settings: Execute as "Me", Access "Anyone"');
    console.log('  4. Test trực tiếp URL trong browser:');
    console.log('    ', FINANCE_API_URL + '?action=get_finance_stats');
    throw error;
  }
};
