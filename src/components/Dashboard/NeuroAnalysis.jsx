import React, { useState, useEffect } from 'react';
import { generateNeuroAnalysis } from '../../services/neuroUtils';

const NeuroAnalysis = ({ currentStreak, maxStreak, history }) => {
  const [analysis, setAnalysis] = useState('Đang phân tích trạng thái thần kinh...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      try {
        const result = await generateNeuroAnalysis(currentStreak, maxStreak, history);
        setAnalysis(result);
      } catch (error) {
        console.error('Failed to generate analysis:', error);
        setAnalysis('Không thể tải phân tích. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [currentStreak, maxStreak]);

  return (
    <div className="bg-stoic-card p-8 rounded-2xl border border-stoic-accent">
      <h3 className="text-xs font-bold text-stoic-text uppercase tracking-widest mb-4 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-stoic-safe'}`}></span>
        Phân Tích Thần Kinh - Hành Vi
      </h3>
      <div className="prose prose-invert prose-p:text-stoic-light prose-p:leading-relaxed max-w-none">
        {loading ? (
          <p className="mb-4 text-justify opacity-70 animate-pulse">
            🧠 Đang tạo phân tích bằng AI (Groq Llama 3.3)...
          </p>
        ) : (
          analysis.split('\n\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-justify opacity-90 hover:opacity-100 transition-opacity">
              {paragraph}
            </p>
          ))
        )}
      </div>
    </div>
  );
};

export default NeuroAnalysis;
