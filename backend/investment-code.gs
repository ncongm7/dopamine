/**
 * INVESTMENT HUB - GOOGLE APPS SCRIPT BACKEND
 * Lưu trữ dữ liệu phân tích cơ bản cho 5 mã cổ phiếu chiến lược
 * Sheet: "StockAnalysis"
 */

function doGet(e) {
  const action = e.parameter.action;
  
  try {
    if (action === 'get_stocks') {
      const data = getStockAnalysis();
      return ContentService
        .createTextOutput(JSON.stringify(data))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (action === 'update_now') {
      // Trigger manual update
      autoUpdateStockData();
      return ContentService
        .createTextOutput(JSON.stringify({ 
          status: 'success', 
          message: 'Data updated from VNDirect API' 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: 'Invalid action' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        status: 'error', 
        message: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Helper to safely parse float from potentially error cells
function safeParseFloat(value) {
  if (!value) return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    // Check for Sheet errors
    if (value.startsWith('#')) return 0;
    // Remove commas if locale uses comma for decimals or thousands
    const cleanValue = value.replace(/,/g, '');
    const floatVal = parseFloat(cleanValue);
    return isNaN(floatVal) ? 0 : floatVal;
  }
  return 0;
}

function getStockAnalysis() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('StockAnalysis');
  
  if (!sheet) {
    throw new Error('Sheet "StockAnalysis" không tồn tại');
  }
  
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return {
      status: 'success',
      data: [],
      lastUpdate: new Date().toISOString()
    };
  }
  
  const data = sheet.getRange(2, 1, lastRow - 1, 9).getValues();
  
  const stocks = data.map(row => {
    const symbol = String(row[0]).trim().toUpperCase();
    if (!symbol) return null;

    // Safely parse numbers (handle #N/A, #ERROR!)
    const pe = safeParseFloat(row[2]);
    const peg = safeParseFloat(row[3]);
    const debtRatio = safeParseFloat(row[4]);
    const currentPrice = safeParseFloat(row[8]);
    
    // Other fields
    const name = String(row[1] || '');
    const score = String(row[5] || 'N/A');
    const story = String(row[6] || 'Chưa có dữ liệu');
    const entryCondition = String(row[7] || 'Xem biểu đồ');

    // Calculate Health Score (chỉ tính nếu có dữ liệu)
    let healthScore = 0;
    if (pe > 0) {
      if (pe < 15) healthScore += 30;
      else if (pe < 20) healthScore += 20;
    }
    
    if (peg > 0) {
      if (peg < 1) healthScore += 30;
      else if (peg < 1.5) healthScore += 20;
    }
    
    // If PE/PEG missing, give base score to avoid displaying as "bad"
    if (pe === 0 && peg === 0) {
      healthScore = 50; // Neutral score for new data
    }

    // Rating
    let rating = 'HOLD';
    if (healthScore >= 70) rating = 'BUY';
    else if (healthScore >= 50) rating = 'ACCUMULATE';
    else if (healthScore < 30) rating = 'AVOID';
    
    return {
      symbol: symbol,
      name: name,
      pe: pe,
      peg: peg,
      debtRatio: debtRatio,
      score: score,
      story: story,
      entryCondition: entryCondition,
      currentPrice: currentPrice, // Price from CafeF crawler
      referencePrice: currentPrice, // Compatibility
      healthScore: healthScore,
      rating: rating
    };
  }).filter(s => s !== null);
  
  return {
    status: 'success',
    data: stocks,
    lastUpdate: new Date().toISOString(),
    count: stocks.length
  };
}

/**
 * Hàm test - chạy trong Apps Script Editor
 */
function testGetStockAnalysis() {
  const result = getStockAnalysis();
  Logger.log(JSON.stringify(result, null, 2));
}
