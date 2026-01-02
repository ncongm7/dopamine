# Hướng Dẫn Setup Google Apps Script Backend

## Bước 1: Chuẩn bị Google Sheet

1. Mở Google Sheet của bạn: `dopamine-app`
2. Tạo sheet tên **"Logs"** (chính xác tên này)
3. Thêm header vào dòng đầu tiên:
   - A1: `date`
   - B1: `status`
   - C1: `streak_count`
   - D1: `max_streak_snapshot`

4. Thêm vài dòng dữ liệu mẫu để test:
   ```
   Row 2: 2026-01-01 | clean | 0 | 0
   Row 3: 2026-01-02 | clean | 0 | 0
   ```

## Bước 2: Deploy Google Apps Script

1. Trong Google Sheet, click **Extensions** → **Apps Script**
2. Xóa code mặc định
3. Copy toàn bộ code từ file `backend/code.gs` vào
4. Click **Save** (icon đĩa mềm)
5. Chạy function `setup()`:
   - Chọn function `setup` từ dropdown
   - Click **Run**
   - Cho phép quyền truy cập khi được hỏi
6. Deploy:
   - Click **Deploy** → **New deployment**
   - Click icon ⚙️ → Chọn **Web app**
   - Cấu hình:
     - **Execute as**: Me
     - **Who has access**: Anyone
   - Click **Deploy**
   - **Copy URL** được tạo ra

## Bước 3: Cập nhật Frontend

1. Mở file `src/services/api.js`
2. Thay URL vào dòng 4:
   ```javascript
   const API_URL = 'YOUR_COPIED_URL_HERE';
   ```
3. Đảm bảo `USE_MOCK = false`

## Bước 4: Test API

### Test bằng Browser Console:
1. Mở app (`npm run dev`)
2. Mở DevTools (F12)
3. Vào tab **Console**
4. Chạy lệnh test:
   ```javascript
   fetch('YOUR_URL?action=get_stats')
     .then(r => r.json())
     .then(console.log)
   ```

Nếu thấy `{ currentStreak: ..., maxStreak: ..., history: [...] }` → **Thành công!** ✅

### Lỗi thường gặp:

- **CORS Error**: Đảm bảo "Who has access" = "Anyone"
- **Permission denied**: Chạy lại function `setup()`
- **Sheet not found**: Kiểm tra tên sheet phải là "Logs"
