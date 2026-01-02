/**
 * CAFEF API INTEGRATION (REAL-TIME PRICE ONLY)
 * Sử dụng API do user cung cấp: https://msh-appdata.cafef.vn/rest-api/api/v1/Watchlists/{SYMBOL}/price
 * Bỏ hoàn toàn Google Finance theo yêu cầu.
 */

/**
 * Fetch giá từ CafeF API
 * @param {string} symbol - Mã cổ phiếu (VD: PNJ)
 */
function fetchCafeFPrice(symbol) {
  try {
    const url = `https://msh-appdata.cafef.vn/rest-api/api/v1/Watchlists/${symbol}/price`;
    const response = UrlFetchApp.fetch(url, {
      method: 'GET',
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() !== 200) return 0;
    
    const json = JSON.parse(response.getContentText());
    if (json.succeeded && json.data && json.data.value) {
      // Giá trả về đơn vị 1000đ (vd: 97 -> 97000)
      return json.data.value.price * 1000;
    }
    return 0;
  } catch (e) {
    Logger.log(`Lỗi lấy giá CafeF cho ${symbol}: ${e.toString()}`);
    return 0;
  }
}

/**
 * INITIALIZATION FUNCTION
 * Chạy hàm này để cài đặt sheet lần đầu
 */
function initializeSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('StockAnalysis');
  
  if (!sheet) {
    sheet = ss.insertSheet('StockAnalysis');
  }
  
  const headers = [['Mã', 'Tên', 'PE', 'PEG', 'Nợ/VCSH', 'Điểm', 'Câu chuyện', 'Điều kiện mua', 'Giá hiện tại']];
  
  // Nếu sheet trống thì điền header và mã mẫu
  if (sheet.getLastRow() < 1) {
    sheet.getRange('A1:I1').setValues(headers).setFontWeight('bold').setBackground('#f3f4f6');
    
    const initialData = [
      ['PNJ', 'Vàng bạc PNJ', '', '', '', '', '', '', ''],
      ['FPT', 'FPT Corp', '', '', '', '', '', '', ''],
      ['VSC', 'Viconship', '', '', '', '', '', '', ''],
      ['DPM', 'Đạm Phú Mỹ', '', '', '', '', '', '', ''],
      ['HAH', 'Hải An', '', '', '', '', '', '', '']
    ];
    // Chuyển format thành string để tránh lỗi
    sheet.getRange('A2:I6').setValues(initialData);
  }
  
  // Cập nhật giá ngay lập tức
  updateRealtimeData();
}

/**
 * Hàm cập nhật dữ liệu (Chạy manual hoặc trigger)
 * Chỉ cập nhật GIÁ từ CafeF. Các cột khác giữ nguyên.
 */
function updateRealtimeData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('StockAnalysis');
  if (!sheet) return;
  
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;
  
  // Lấy danh sách mã
  const symbols = sheet.getRange(`A2:A${lastRow}`).getValues();
  
  // Loop qua từng dòng để update giá
  for (let i = 0; i < symbols.length; i++) {
    const symbol = String(symbols[i][0]).trim().toUpperCase();
    if (!symbol) continue;
    
    const rowIndex = i + 2;
    
    // Cập nhật Giá từ CafeF
    const price = fetchCafeFPrice(symbol);
    if (price > 0) {
      sheet.getRange(rowIndex, 9).setValue(price); // Cột I: Giá
    }
    
    // Không đụng vào cột PE (để User tự nhập tay)
  }
  
  // Update timestamp
  sheet.getRange(1, 10).setValue(`Cập nhật lúc: ${new Date().toLocaleTimeString('vi-VN')}`);
  Logger.log("✅ Đã cập nhật xong giá từ CafeF!");
}

function testCafeF() {
  const price = fetchCafeFPrice('PNJ');
  Logger.log(`Giá PNJ: ${price}`);
}
