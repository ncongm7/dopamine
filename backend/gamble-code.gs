// Google Apps Script - Gambling Recovery Module
// Deploy this as a Web App (Execute as: Me, Who has access: Anyone)
// Sheet name: GambleLogs
// Columns: date | status | money_saved | small_win_note | urge_count

function doGet(e) {
  return handleGambleRequest(e);
}

function doPost(e) {
  return handleGambleRequest(e);
}

function handleGambleRequest(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = doc.getSheetByName("GambleLogs");
    
    // Auto-create sheet if it doesn't exist
    if (!sheet) {
      sheet = doc.insertSheet("GambleLogs");
      sheet.appendRow(["date", "status", "money_saved", "small_win_note", "urge_count"]);
    }
    
    // Parse request
    let params = e.parameter;
    if (e.postData && e.postData.contents) {
      try {
        params = JSON.parse(e.postData.contents);
      } catch (err) {
        // Use GET parameters if POST parsing fails
      }
    }
    
    const action = params.action;
    
    // GET_STATS: Retrieve recovery statistics
    if (action === "get_gamble_stats") {
      return getGambleStats(sheet);
    }
    
    // CHECK_IN: Log daily check-in
    if (action === "gamble_check_in") {
      return handleGambleCheckIn(sheet, params);
    }
    
    // RECORD_URGE: Quick urge logging (doesn't break streak)
    if (action === "record_urge") {
      return recordUrge(sheet);
    }
    
    // UPDATE_TOTAL_LOST: One-time setup for recovery calculation
    if (action === "update_total_lost") {
      return updateTotalLost(params.amount);
    }
    
    // GET_WEEKLY_REPORT: AI-generated weekly analysis
    if (action === "get_weekly_report") {
      return getWeeklyReport(sheet);
    }
    
    return createResponse({ status: "error", message: "Invalid action" });
    
  } catch (error) {
    return createResponse({ status: "error", message: error.toString() });
  } finally {
    lock.releaseLock();
  }
}

// Helper: Create JSON response
function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// GET_STATS: Calculate and return recovery metrics
function getGambleStats(sheet) {
  const data = sheet.getDataRange().getValues();
  const rows = data.slice(1); // Skip header
  
  if (rows.length === 0) {
    return createResponse({
      gambleStreak: 0,
      totalSaved: 0,
      smallWins: [],
      urgeHistory: [],
      maxStreak: 0,
      totalUrges: 0
    });
  }
  
  // Calculate current streak (handling multiple entries per day)
  let gambleStreak = 0;
  let lastDateStr = "";
  
  // Sort rows by date ascending just in case
  // Note: Assuming rows are generally appended in order, but date comparison is safer
  const reversedRows = [...rows].reverse();
  
  for (let i = 0; i < reversedRows.length; i++) {
    const row = reversedRows[i];
    const dateStr = formatDate(row[0]);
    const status = row[1];
    
    // Skip if we already counted this date
    if (dateStr === lastDateStr) {
      // If we found a relapse on the same day that was previously clean, we might need to handle that
      // But usually relapse overrides clean. For now, we assume if ANY entry is clean, it counts?
      // Or if ANY entry is relapse, it breaks?
      // Let's stick effectively to: if we see a relapse, it breaks. If we see clean, we count it ONLY if it's a new day.
      if (status !== "clean") {
        gambleStreak = 0; // Reset if relapse found on same day? Or just stop?
        // If today I logged clean, then logged relapse, the streak should be broken.
        break;
      }
      continue;
    }
    
    if (status === "clean") {
      gambleStreak++;
      lastDateStr = dateStr;
    } else {
      break;
    }
  }
  
  // Calculate max streak (handling multiple entries per day)
  let maxStreak = 0;
  let tempStreak = 0;
  let tempLastDateStr = "";
  
  rows.forEach(row => {
    const dateStr = formatDate(row[0]);
    const status = row[1];
    
    if (dateStr === tempLastDateStr) {
       // If same day, checked relapse logic above, but for simple max streak of 'clean' days:
       // If multiple cleanup entries, ignore.
       // If relapse entry, it resets.
       if (status !== "clean") {
         tempStreak = 0;
       }
       return; 
    }
    
    tempLastDateStr = dateStr;
    
    if (status === "clean") {
      tempStreak++;
      if (tempStreak > maxStreak) maxStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
  });
  
  // Calculate total money saved
  let totalSaved = 0;
  rows.forEach(row => {
    if (row[2]) totalSaved += parseFloat(row[2]);
  });
  
  // Get small wins (last 10)
  const smallWins = rows
    .filter(row => row[3] && row[3].trim() !== "")
    .slice(-10)
    .map(row => ({
      date: formatDate(row[0]),
      note: row[3]
    }))
    .reverse();
  
  // Get urge history (last 7 days)
  const urgeHistory = rows
    .slice(-7)
    .map(row => ({
      date: formatDate(row[0]),
      count: row[4] || 0
    }));
  
  // Calculate total urges resisted
  let totalUrges = 0;
  rows.forEach(row => {
    if (row[4]) totalUrges += parseInt(row[4]);
  });
  
  return createResponse({
    gambleStreak,
    maxStreak,
    totalSaved,
    smallWins,
    urgeHistory,
    totalUrges,
    lastCheckIn: rows.length > 0 ? formatDate(rows[rows.length - 1][0]) : null
  });
}

// CHECK_IN: Log daily check-in
function handleGambleCheckIn(sheet, params) {
  const date = new Date();
  const status = params.status || "clean"; // 'clean' or 'relapse'
  const moneySaved = parseFloat(params.money_saved) || 0;
  const smallWinNote = params.small_win_note || "";
  const urgeCount = parseInt(params.urge_count) || 0;
  
  sheet.appendRow([date, status, moneySaved, smallWinNote, urgeCount]);
  
  return createResponse({
    status: "success",
    message: "Check-in recorded",
    data: {
      date: formatDate(date),
      status,
      moneySaved,
      smallWinNote,
      urgeCount
    }
  });
}

// RECORD_URGE: Increment today's urge count without breaking streak
function recordUrge(sheet) {
  const data = sheet.getDataRange().getValues();
  const today = new Date();
  const todayStr = formatDate(today);
  
  // Find today's row
  let todayRowIndex = -1;
  for (let i = data.length - 1; i >= 1; i--) {
    if (formatDate(data[i][0]) === todayStr) {
      todayRowIndex = i;
      break;
    }
  }
  
  if (todayRowIndex !== -1) {
    // Update existing row
    const currentUrges = parseInt(data[todayRowIndex][4]) || 0;
    sheet.getRange(todayRowIndex + 1, 5).setValue(currentUrges + 1);
    
    return createResponse({
      status: "success",
      message: "Urge recorded",
      urgeCount: currentUrges + 1
    });
  } else {
    // Create new row for today (auto clean status)
    sheet.appendRow([today, "clean", 0, "", 1]);
    
    return createResponse({
      status: "success",
      message: "Urge recorded (new day)",
      urgeCount: 1
    });
  }
}

// UPDATE_TOTAL_LOST: Store total money lost (for recovery calculation)
function updateTotalLost(amount) {
  const scriptProperties = PropertiesService.getScriptProperties();
  scriptProperties.setProperty('GAMBLE_TOTAL_LOST', amount.toString());
  
  return createResponse({
    status: "success",
    message: "Total lost amount updated",
    totalLost: amount
  });
}

// GET_WEEKLY_REPORT: Generate weekly analysis
function getWeeklyReport(sheet) {
  const data = sheet.getDataRange().getValues();
  const rows = data.slice(1);
  
  // Get last 7 days
  const last7Days = rows.slice(-7);
  
  let weekSaved = 0;
  let weekUrges = 0;
  let cleanDays = 0;
  
  last7Days.forEach(row => {
    if (row[2]) weekSaved += parseFloat(row[2]);
    if (row[4]) weekUrges += parseInt(row[4]);
    if (row[1] === "clean") cleanDays++;
  });
  
  // Calculate investment equivalent (FPT stock at ~100k)
  const fptShares = Math.floor(weekSaved / 100000);
  
  // Generate analysis
  const analysis = `Tuần qua bạn đã giữ được ${formatMoney(weekSaved)} đồng. ` +
    `Với số tiền này, bạn có thể mua được ${fptShares} cổ phiếu FPT (giá ~100k/cp). ` +
    `Bạn đã chống lại được ${weekUrges} cơn thèm chơi - mỗi lần là một chiến thắng về mặt thần kinh học. ` +
    `Hệ thống dopamine của bạn đang được tái lập trình để tìm kiếm phần thưởng từ đầu tư thay vì cờ bạc. ` +
    `${cleanDays === 7 ? "Tuần hoàn hảo! " : ""}Tiếp tục duy trì.`;
  
  return createResponse({
    weekSaved,
    weekUrges,
    cleanDays,
    fptShares,
    analysis
  });
}

// Helper: Format date to DD/MM/YYYY
function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

// Helper: Format money
function formatMoney(amount) {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
