// Google Apps Script Code
// Deploy this as a Web App (Execute as: Me, Who has access: Anyone)

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    // Auto-detect spreadsheet (no setup needed!)
    const doc = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = doc.getSheetByName("Logs");
    
    // Action: GET_STATS
    if (e.parameter.action === "get_stats" || (e.postData && JSON.parse(e.postData.contents).action === "get_stats")) {
       const data = sheet.getDataRange().getValues();
       const headers = data[0];
       const rows = data.slice(1);
       
       let currentStreak = 0;
       let maxStreak = 0;
       
       // Simple streak calculation (assuming sorted by date)
       // This is a simplified logic. Real logic would rely on date diffs.
       for (let i = rows.length - 1; i >= 0; i--) {
         if (rows[i][1] === "clean") {
           currentStreak++;
         } else {
           break;
         }
       }
       
       // Calculate Max Streak (heuristic)
       let tempStreak = 0;
       rows.forEach(row => {
         if (row[1] === "clean") {
           tempStreak++;
           if (tempStreak > maxStreak) maxStreak = tempStreak;
         } else {
           tempStreak = 0;
         }
       });

       return ContentService.createTextOutput(JSON.stringify({
         currentStreak,
         maxStreak,
         history: rows.slice(-7) // Last 7 entries
       })).setMimeType(ContentService.MimeType.JSON);
    }

    // Action: CHECK_IN (via GET parameters to avoid CORS)
    if (e.parameter.action === "check_in") {
      const date = new Date();
      const status = e.parameter.status; // 'clean' or 'relapse'
      
      sheet.appendRow([date, status, 0, 0]); // Recalc will happen on read or subsequent triggers
      
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        message: "Check-in recorded"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
         status: "error",
         message: "Invalid action"
       })).setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: e.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
