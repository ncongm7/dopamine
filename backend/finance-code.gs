/**
 * FINANCE MODULE - GOOGLE APPS SCRIPT BACKEND
 * Kết nối với Sheet "Chi tiêu" để theo dõi giao dịch tài chính
 * Sheet structure: Thời gian (A) | Ngân hàng (B) | Số tiền (C) | Loại (D) | Nội dung (E) | Số dư (F)
 */

function doGet(e) {
  try {
    const action = e.parameter.action || 'get_finance_stats';
    
    if (action === 'get_finance_stats') {
      const data = getFinanceData();
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        data: data
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Invalid action'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function getFinanceData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Trang tính1'); // Đổi tên sheet
  
  if (!sheet) {
    throw new Error('Sheet "Trang tính1" không tồn tại');
  }
  
  // Lấy toàn bộ data (bỏ header row)
  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return {
      summary: { todayTotal: 0, yesterdayTotal: 0, last7DaysTotal: 0, todayCount: 0 },
      transactions: [],
      chartData: [],
      currentBalance: 0,
      impulseTransactions: []
    };
  }
  
  const data = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
  
  // Parse và clean data
  const transactions = data.map((row, index) => {
    const rawAmount = String(row[2]).replace(/[.,đĐ\s]/g, ''); // Clean số tiền
    const amount = parseInt(rawAmount) || 0;
    
    return {
      id: index + 2, // Row number
      timestamp: row[0] ? new Date(row[0]) : null,
      bank: row[1] || '',
      amount: amount,
      type: row[3] || '',
      description: row[4] || '',
      balance: parseFloat(String(row[5]).replace(/[.,đĐ\s]/g, '')) || 0,
      category: categorizeByAmount(amount)
    };
  }).filter(t => t.timestamp); // Loại bỏ row không có timestamp
  
  // Sort theo thời gian giảm dần
  transactions.sort((a, b) => b.timestamp - a.timestamp);
  
  // Tính toán aggregations
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const last7DaysStart = new Date(todayStart);
  last7DaysStart.setDate(last7DaysStart.getDate() - 7);
  
  const todayTransactions = transactions.filter(t => t.timestamp >= todayStart);
  const yesterdayTransactions = transactions.filter(t => 
    t.timestamp >= yesterdayStart && t.timestamp < todayStart
  );
  const last7DaysTransactions = transactions.filter(t => t.timestamp >= last7DaysStart);
  
  const summary = {
    todayTotal: todayTransactions.reduce((sum, t) => sum + t.amount, 0),
    yesterdayTotal: yesterdayTransactions.reduce((sum, t) => sum + t.amount, 0),
    last7DaysTotal: last7DaysTransactions.reduce((sum, t) => sum + t.amount, 0),
    todayCount: todayTransactions.length
  };
  
  // Chart data: Aggregation by day (last 14 days)
  const chartData = generateChartData(transactions, 14);
  
  // Impulse detection: >2 transactions within 1 hour
  const impulseTransactions = detectImpulseSpending(transactions);
  
  // Current balance (latest transaction)
  const currentBalance = transactions.length > 0 ? transactions[0].balance : 0;
  
  return {
    summary: summary,
    transactions: transactions.slice(0, 50), // Top 50 transactions
    chartData: chartData,
    currentBalance: currentBalance,
    impulseTransactions: impulseTransactions
  };
}

function categorizeByAmount(amount) {
  if (amount < 50000) return 'Micro';
  if (amount <= 500000) return 'Medium';
  return 'High';
}

function generateChartData(transactions, days) {
  const chartData = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    date.setDate(date.getDate() - i);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);
    
    const dayTransactions = transactions.filter(t => 
      t.timestamp >= date && t.timestamp < nextDate
    );
    
    chartData.push({
      date: Utilities.formatDate(date, Session.getScriptTimeZone(), 'dd/MM'),
      amount: dayTransactions.reduce((sum, t) => sum + t.amount, 0),
      count: dayTransactions.length
    });
  }
  
  return chartData;
}

function detectImpulseSpending(transactions) {
  const impulseIds = [];
  const oneHour = 60 * 60 * 1000; // milliseconds
  
  for (let i = 0; i < transactions.length; i++) {
    const current = transactions[i];
    let countInHour = 1;
    
    // Check transactions within 1 hour
    for (let j = i + 1; j < transactions.length; j++) {
      const diff = Math.abs(current.timestamp - transactions[j].timestamp);
      if (diff <= oneHour) {
        countInHour++;
      } else {
        break; // Already sorted by time
      }
    }
    
    if (countInHour > 2) {
      impulseIds.push(current.id);
    }
  }
  
  return impulseIds;
}
