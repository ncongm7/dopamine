import React, { useEffect, useState } from 'react';
import { MessageSquare, ExternalLink, Maximize2 } from 'lucide-react';

const ChatGPTModule = () => {
  const [popupWindow, setPopupWindow] = useState(null);

  const openChatGPT = () => {
    // Close existing popup if any
    if (popupWindow && !popupWindow.closed) {
      popupWindow.focus();
      return;
    }

    // Open new popup window
    const width = 1200;
    const height = 800;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    const popup = window.open(
      'https://chatgpt.com',
      'ChatGPT',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );

    setPopupWindow(popup);
  };

  useEffect(() => {
    // Auto-open on mount
    openChatGPT();

    // Cleanup on unmount
    return () => {
      if (popupWindow && !popupWindow.closed) {
        popupWindow.close();
      }
    };
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center">
      {/* Header */}
      <div className="text-center max-w-2xl">
        <div className="mb-6 flex justify-center">
          <div className="p-6 bg-stoic-card rounded-full border-2 border-stoic-safe">
            <MessageSquare size={64} className="text-stoic-safe" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">
          ChatGPT Assistant
        </h1>
        
        <p className="text-stoic-text mb-8 text-lg">
          ChatGPT đã được mở trong cửa sổ popup riêng. Nếu bị chặn bởi trình duyệt, 
          hãy cho phép popup và click nút bên dưới.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mb-8">
          <button
            onClick={openChatGPT}
            className="flex items-center gap-3 px-6 py-4 bg-stoic-safe hover:bg-blue-600 text-white rounded-xl transition-colors font-medium text-lg"
          >
            <Maximize2 size={24} />
            Mở ChatGPT Popup
          </button>

          <a
            href="https://chatgpt.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-4 bg-stoic-card hover:bg-stoic-bg text-stoic-light hover:text-white border border-stoic-accent rounded-xl transition-colors font-medium text-lg"
          >
            <ExternalLink size={24} />
            Mở Tab Mới
          </a>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
          <div className="bg-stoic-card p-6 rounded-2xl border border-stoic-accent text-left">
            <h3 className="text-sm font-bold text-stoic-safe uppercase tracking-wider mb-2">
              💡 Tại sao Popup?
            </h3>
            <p className="text-sm text-stoic-text">
              ChatGPT chặn iframe do chính sách bảo mật. Popup window là cách duy nhất 
              để nhúng trang ChatGPT thật vào app.
            </p>
          </div>

          <div className="bg-stoic-card p-6 rounded-2xl border border-stoic-accent text-left">
            <h3 className="text-sm font-bold text-stoic-safe uppercase tracking-wider mb-2">
              � Bảo mật
            </h3>
            <p className="text-sm text-stoic-text">
              Popup mở trực tiếp chatgpt.com - hoàn toàn an toàn và giống như 
              bạn mở tab mới, chỉ khác là trong cửa sổ riêng.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatGPTModule;
