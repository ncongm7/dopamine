import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, AlertCircle } from 'lucide-react';

const MentalCheck = ({ onPass, onFail }) => {
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-stoic-bg/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-stoic-card border-2 border-stoic-safe rounded-3xl p-8 shadow-2xl">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-6 bg-stoic-safe/10 rounded-full border-2 border-stoic-safe">
            <Brain size={64} className="text-stoic-safe" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-white text-center mb-4">
          Mental Check
        </h2>

        {/* Question */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle size={24} className="text-yellow-500 flex-shrink-0 mt-1" />
            <div>
              <p className="text-xl text-yellow-400 font-bold mb-2">
                Bạn đang tìm kiếm cơ hội đầu tư hay chỉ đang tìm sự phấn khích?
              </p>
              <p className="text-sm text-stoic-text">
                Đầu tư là một hoạt động trí tuệ, không phải đánh bạc. 
                Hãy đảm bảo bạn có kế hoạch rõ ràng trước khi xem biểu đồ.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-stoic-bg/50 p-4 rounded-xl text-center">
            <p className="text-xs text-stoic-text mb-1">Thời gian suy nghĩ</p>
            <p className="text-2xl font-bold text-white">{timeSpent}s</p>
          </div>
          <div className="bg-stoic-bg/50 p-4 rounded-xl text-center">
            <p className="text-xs text-stoic-text mb-1">Khuyến nghị tối thiểu</p>
            <p className="text-2xl font-bold text-stoic-safe">10s</p>
          </div>
        </div>

        {/* Principles */}
        <div className="mb-6 space-y-2">
          <p className="text-xs text-stoic-text uppercase font-bold">Nguyên tắc đầu tư:</p>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm text-stoic-light">
              <span className="text-stoic-safe">✓</span>
              Tôi đã nghiên cứu cơ bản về công ty
            </li>
            <li className="flex items-start gap-2 text-sm text-stoic-light">
              <span className="text-stoic-safe">✓</span>
              Tôi có kế hoạch mua/bán rõ ràng
            </li>
            <li className="flex items-start gap-2 text-sm text-stoic-light">
              <span className="text-stoic-safe">✓</span>
              Tôi chỉ đầu tư số tiền có thể chấp nhận mất
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={onFail}
            className="flex-1 px-6 py-4 bg-stoic-bg hover:bg-stoic-accent text-stoic-text hover:text-white border border-stoic-accent rounded-xl transition-colors font-medium"
          >
            Tôi cần suy nghĩ lại
          </button>
          <button
            onClick={onPass}
            disabled={timeSpent < 5}
            className={`flex-1 px-6 py-4 rounded-xl transition-colors font-medium flex items-center justify-center gap-2 ${
              timeSpent < 5
                ? 'bg-stoic-bg text-stoic-text cursor-not-allowed'
                : 'bg-stoic-safe hover:bg-blue-600 text-white'
            }`}
          >
            <TrendingUp size={20} />
            Tôi đầu tư có kế hoạch
            {timeSpent < 5 && <span className="text-xs">({5 - timeSpent}s)</span>}
          </button>
        </div>

        {/* Note */}
        <p className="text-xs text-stoic-text text-center mt-4">
          Mental Check sẽ reset sau 24 giờ
        </p>
      </div>
    </div>
  );
};

export default MentalCheck;
