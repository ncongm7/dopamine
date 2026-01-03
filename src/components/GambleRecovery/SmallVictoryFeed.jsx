import React from 'react';
import { motion } from 'framer-motion';
import { Award, Calendar } from 'lucide-react';

const SmallVictoryFeed = ({ victories }) => {
  if (!victories || victories.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#2d5f4f]/10 to-[#0a1628] p-6 rounded-2xl border border-[#2d5f4f]/30 backdrop-blur-md"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-[#2d5f4f]/20 rounded-xl">
            <Award size={24} className="text-[#2d5f4f]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Small Victories</h3>
            <p className="text-xs text-slate-400">Những chiến thắng nhỏ</p>
          </div>
        </div>
        <p className="text-sm text-slate-500 text-center py-8">
          Chưa có chiến thắng nào. Hãy bắt đầu ghi nhận!
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#2d5f4f]/10 to-[#0a1628] p-6 rounded-2xl border border-[#2d5f4f]/30 backdrop-blur-md"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-[#2d5f4f]/20 rounded-xl">
          <Award size={24} className="text-[#2d5f4f]" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Small Victories</h3>
          <p className="text-xs text-slate-400">Những chiến thắng nhỏ</p>
        </div>
      </div>

      {/* Victory Timeline */}
      <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-hide">
        {victories.map((victory, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-3 p-3 bg-slate-900/30 rounded-xl border border-slate-800 hover:border-[#2d5f4f]/30 transition-colors"
          >
            <div className="flex-shrink-0 w-2 h-2 mt-2 bg-[#2d5f4f] rounded-full" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Calendar size={14} className="text-slate-500" />
                <span className="text-xs text-slate-500">{victory.date}</span>
              </div>
              <p className="text-sm text-slate-300">{victory.note}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 p-3 bg-[#2d5f4f]/10 rounded-xl border border-[#2d5f4f]/20">
        <p className="text-xs text-slate-400 text-center">
          <span className="font-bold text-[#2d5f4f]">{victories.length}</span> hoạt động có giá trị thay vì Gambling
        </p>
      </div>

      {/* Motivational Note */}
      <div className="mt-4 text-xs text-slate-500 text-center italic">
        "Thay thế thói quen xấu bằng hành động tích cực"
      </div>
    </motion.div>
  );
};

export default SmallVictoryFeed;
