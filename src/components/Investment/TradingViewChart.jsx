import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const TradingViewChart = ({ symbol }) => {
  const containerRef = useRef(null);
  const widgetRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget
    if (widgetRef.current) {
      containerRef.current.innerHTML = '';
    }

    // Create unique ID for this widget instance
    const widgetId = `tradingview_${symbol}_${Date.now()}`;
    const widgetContainer = document.createElement('div');
    widgetContainer.id = widgetId;
    widgetContainer.style.height = '100%';
    containerRef.current.appendChild(widgetContainer);

    // Load TradingView script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (window.TradingView) {
        widgetRef.current = new window.TradingView.widget({
          container_id: widgetId,
          autosize: true,
          symbol: `HOSE:${symbol}`,
          interval: 'D',
          timezone: 'Asia/Ho_Chi_Minh',
          theme: 'dark',
          style: '1',
          locale: 'vi_VN',
          toolbar_bg: '#0a0c10',
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: false,
          save_image: false,
          studies: [
            'MASimple@tv-basicstudies',
            'RSI@tv-basicstudies',
            'Volume@tv-basicstudies'
          ],
          backgroundColor: '#0a0c10',
          gridColor: '#1e293b',
          hide_top_toolbar: false,
          hide_legend: false,
          withdateranges: true,
          range: '3M',
          details: true,
          hotlist: false,
          calendar: false,
          show_popup_button: false,
          overrides: {
            "paneProperties.background": "#0a0c10",
            "paneProperties.backgroundType": "solid",
          }
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [symbol]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full bg-slate-900/50 rounded-2xl overflow-hidden border border-slate-800 backdrop-blur-md shadow-2xl shadow-black/50"
    >
      <div
        ref={containerRef}
        className="w-full h-full"
      />
    </motion.div>
  );
};

export default TradingViewChart;
