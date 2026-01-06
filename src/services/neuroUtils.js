const GROQ_API_KEY = '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';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

let analysisCache = {};

export const generateNeuroAnalysis = async (currentStreak, maxStreak, last7Days) => {
  const cacheKey = `${currentStreak}-${maxStreak}`;
  if (analysisCache[cacheKey]) return analysisCache[cacheKey];

  try {
    const prompt = `
Bạn là chuyên gia thần kinh học và hành vi, chuyên về dopamine detox và phục hồi nhận thức.
Nhiệm vụ: Viết bài phân tích trạng thái não bằng TIẾNG VIỆT dựa trên dữ liệu sau:

- Chuỗi ngày hiện tại (Current Streak): ${currentStreak}
- Chuỗi dài nhất (Max Streak): ${maxStreak}
- 7 ngày gần nhất: ${JSON.stringify(last7Days)}

Yêu cầu:
1. Tone: Bình tĩnh, khoa học, không phán xét, không tích cực sáo rỗng
2. Độ dài: 250-400 từ
3. Văn xuôi, chia 2-3 đoạn ngắn
4. Nội dung:
   - Giải thích trạng thái dopamine dựa trên streak
   - Nếu streak = 0: Brain Fog, cách phục hồi
   - Nếu streak 1-7: Withdrawal + upregulation receptor
   - Nếu streak 7-30: Flatline + tái cấu trúc myelin
   - Nếu streak > 30: Mastery + duy trì

Chỉ viết báo cáo sinh lý thần kinh ngắn gọn, tập trung vào hành vi và não bộ.
Không động viên, không phán xét, không emoji, không tiêu đề.
`;

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'Bạn là chuyên gia thần kinh học chuyên về dopamine detox và phục hồi nhận thức. Luôn trả lời bằng tiếng Việt.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 600
      }),
    });

    if (!response.ok) throw new Error(`Groq API error: ${response.status}`);
    const data = await response.json();
    const analysis = data.choices[0]?.message?.content || getFallbackAnalysis(currentStreak);
    analysisCache[cacheKey] = analysis;
    return analysis;

  } catch (error) {
    console.error('Groq API Error:', error);
    return getFallbackAnalysis(currentStreak);
  }
};

function getFallbackAnalysis(streak) {
  if (streak === 0) return `BÁO CÁO TRẠNG THÁI: Brain Fog. Giải thích: Downregulation receptor dopamine sau relapse. Hãy bình tĩnh, não sẽ phục hồi tự nhiên.`;
  if (streak < 7) return `BÁO CÁO TRẠNG THÁI: Giai đoạn withdrawal (Ngày ${streak}). Dopamine đang upregulation. Có thể mệt, chán nhưng não đang chữa lành.`;
  if (streak < 30) return `BÁO CÁO TRẠNG THÁI: Flatline (Ngày ${streak}). Dopamine cơ bản ổn định. Tập trung vào hoạt động giá trị cao để nuôi lại dopamine lành mạnh.`;
  return `BÁO CÁO TRẠNG THÁI: Mastery (Ngày ${streak}). Hệ thống phần thưởng não được tái lập trình. Duy trì thành quả, tránh tự mãn.`;
}
