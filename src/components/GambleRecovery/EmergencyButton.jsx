import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, TrendingUp, BookOpen, Phone } from 'lucide-react';
import { recordUrge } from '../../services/gambleApi';

const EmergencyButton = ({ onUrgeRecorded, onSwitchToInvestment }) => {
  const [showModal, setShowModal] = useState(false);
  const [breathingTimer, setBreathingTimer] = useState(60);
  const [isBreathing, setIsBreathing] = useState(false);

  const handleEmergencyClick = async () => {
    // Record the urge
    try {
      await recordUrge();
      if (onUrgeRecorded) onUrgeRecorded();
    } catch (err) {
      console.error('Error recording urge:', err);
    }
    
    // Show intervention modal
    setShowModal(true);
  };

  const startBreathingExercise = () => {
    setIsBreathing(true);
    setBreathingTimer(60);
    
    const interval = setInterval(() => {
      setBreathingTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsBreathing(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const redirectToInvestment = () => {
    setShowModal(false);
    // Use callback to switch view in parent App component
    if (onSwitchToInvestment) {
      onSwitchToInvestment();
    }
  };

  return (
    <>
      {/* Emergency Button */}
      <motion.button
        onClick={handleEmergencyClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-6 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold text-xl rounded-2xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all"
      >
        <div className="flex items-center justify-center gap-3">
          <AlertTriangle size={28} />
          <span>🚨 TÔI ĐANG THÈM CHƠI</span>
        </div>
      </motion.button>

      {/* Intervention Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0a1628] border border-[#2d5f4f] rounded-2xl p-8 max-w-md w-full"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Hãy dừng lại 60 giây
                </h2>
                <p className="text-sm text-slate-400">
                  Cơn thèm sẽ qua. Hãy thử một trong những cách sau:
                </p>
              </div>

              {/* Breathing Exercise */}
              <div className="mb-6">
                {!isBreathing ? (
                  <button
                    onClick={startBreathingExercise}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:shadow-lg transition-all"
                  >
                    🧘 Bắt đầu hít thở 60 giây
                  </button>
                ) : (
                  <div className="text-center p-6 bg-blue-600/20 border border-blue-500 rounded-xl">
                    <p className="text-4xl font-bold text-blue-400 mb-2">
                      {breathingTimer}s
                    </p>
                    <p className="text-sm text-slate-300">
                      {breathingTimer > 30 ? 'Hít vào sâu...' : 'Thở ra chậm...'}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={redirectToInvestment}
                  className="w-full py-3 bg-[#2d5f4f] text-white font-medium rounded-xl hover:bg-[#3d7f6f] transition-colors flex items-center justify-center gap-2"
                >
                  <TrendingUp size={20} />
                  Xem Investment Hub
                </button>

                <button
                  onClick={() => window.open('https://cafef.vn', '_blank')}
                  className="w-full py-3 bg-slate-700 text-white font-medium rounded-xl hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                >
                  <BookOpen size={20} />
                  Đọc tin tài chính
                </button>

                <button
                  className="w-full py-3 bg-slate-700 text-white font-medium rounded-xl hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Phone size={20} />
                  Gọi cho người thân
                </button>
              </div>

              {/* Motivational Message */}
              <div className="mt-6 p-4 bg-[#2d5f4f]/10 border border-[#2d5f4f]/30 rounded-xl">
                <p className="text-sm text-slate-300 text-center">
                  "Cơn thèm chỉ kéo dài 10-15 phút. Bạn đang mạnh mẽ hơn bạn nghĩ."
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EmergencyButton;
