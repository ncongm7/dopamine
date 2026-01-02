# Cách Test API Nhanh

## Cách 1: Dùng Browser Console (Đơn giản nhất)

1. Chạy app: `npm run dev`
2. Mở browser, nhấn **F12** → tab **Console**
3. Gõ lệnh:
   ```javascript
   no
   ```
4. Xem kết quả:
   - ✅ Thành công: Sẽ hiện `currentStreak`, `maxStreak`, `history`
   - ❌ Lỗi: Đọc message lỗi và làm theo hướng dẫn

## Cách 2: Test trực tiếp URL

Mở browser, paste URL này (thay YOUR_URL):
```
YOUR_URL?action=get_stats
```

Nếu thấy JSON response → API hoạt động! ✅

## Cách 3: Xem Network Tab

1. F12 → tab **Network**
2. Click nút [MAINTAIN] hoặc [RELAPSE] trong app
3. Xem request có status 200 không
4. Click vào request → xem Response

---

## Checklist Setup Google Apps Script

- [ ] Tạo sheet tên "Logs" với header: date | status | streak_count | max_streak_snapshot
- [ ] Extensions → Apps Script → paste code từ `backend/code.gs`
- [ ] Chạy function `setup()` và cho phép quyền
- [ ] Deploy → Web app → Execute as: Me, Who has access: Anyone
- [ ] Copy URL và paste vào `src/services/api.js` dòng 4
- [ ] Đảm bảo `USE_MOCK = false`
- [ ] Restart dev server
