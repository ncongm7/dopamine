import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Plus } from 'lucide-react';
import { recordUrge } from '../../services/gambleApi';

const UrgeCounter = ({ todayUrges, totalUrges, onUrgeRecorded }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleRecordUrge = async () => {
    try {
      setIsRecording(true);
      await recordUrge();
      
      // Show success feedback
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 2000);
      
      // Reload parent stats
      if (onUrgeRecorded) {
        onUrgeRecorded();
      }
    } catch (err) {
      console.error('Error recording urge:', err);
      alert('Lỗi khi ghi nhận. Vui lòng thử lại.');
    } finally {
      setIsRecording(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-[#2d5f4f]/20 to-[#0a1628] p-6 rounded-2xl border border-[#2d5f4f]/30 backdrop-blur-md"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-[#2d5f4f]/20 rounded-xl">
          <Brain size={28} className="text-[#2d5f4f]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Urge Victories</h3>
          <p className="text-xs text-slate-400">Chiến thắng cơn thèm</p>
        </div>
      </div>

      {/* Today's Urges */}
      <div className="mb-4">
        <p className="text-sm text-slate-400 mb-2">Hôm nay</p>
        <div className="flex items-center gap-2">
          {[...Array(Math.min(todayUrges, 10))].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="w-8 h-8 bg-[#2d5f4f] rounded-lg"
            />
          ))}
          {todayUrges > 10 && (
            <span className="text-sm text-slate-400 ml-2">+{todayUrges - 10}</span>
          )}
        </div>
        <p className="text-2xl font-bold text-white mt-2">
          {todayUrges} lần
        </p>
      </div>

      {/* Total Urges */}
      <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700 mb-4">
        <p className="text-xs text-slate-400 mb-1">Tổng số cơn thèm đã thắng</p>
        <p className="text-3xl font-bold text-[#2d5f4f]">{totalUrges}</p>
        <p className="text-xs text-slate-500 mt-1">Mỗi lần là một chiến thắng thần kinh học</p>
      </div>

      {/* Record Button */}
      <motion.button
        onClick={handleRecordUrge}
        disabled={isRecording}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 bg-gradient-to-r from-[#2d5f4f] to-[#3d7f6f] text-white font-medium rounded-xl hover:shadow-lg hover:shadow-[#2d5f4f]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        {isRecording ? 'Đang ghi...' : 'Tôi vừa thắng 1 cơn thèm'}
      </motion.button>

      {/* Feedback Message */}
      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-3 p-3 bg-[#2d5f4f]/20 border border-[#2d5f4f] rounded-xl text-center"
        >
          <p className="text-sm text-[#2d5f4f] font-medium">
            ✓ Ghi nhận! Dopamine receptor đang upregulation.
          </p>
        </motion.div>
      )}

      {/* Motivational Note */}
      <div className="mt-4 text-xs text-slate-500 text-center italic">
        "Mỗi lần kháng cự là một lần não bộ mạnh hơn"
      </div>
    </motion.div>
  );
};

export default UrgeCounter;
