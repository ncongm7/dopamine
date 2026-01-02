import React, { useState, useEffect } from 'react';
import { ExternalLink, TrendingUp, RefreshCw, X, BookOpen } from 'lucide-react';

// Fallback data - hiện ngay để không bị trống
const FALLBACK_NEWS = [
  { title: "VN-Index biến động mạnh phiên cuối năm", link: "https://cafef.vn", description: "Thị trường chứng khoán ghi nhận phiên giao dịch sôi động với thanh khoản tăng cao. Nhà đầu tư cần theo dõi sát các tín hiệu kỹ thuật.", pubDate: new Date().toISOString() },
  { title: "Fed giữ nguyên lãi suất, tác động đến thị trường", link: "https://cafef.vn", description: "Quyết định của Cục Dự trữ Liên bang Mỹ ảnh hưởng trực tiếp đến dòng vốn ngoại và tỷ giá trong nước.", pubDate: new Date().toISOString() },
  { title: "Bất động sản 2026: Xu hướng và cơ hội", link: "https://cafef.vn", description: "Chuyên gia phân tích các phân khúc tiềm năng và rủi ro cần lưu ý trong năm mới.", pubDate: new Date().toISOString() },
  { title: "Cổ phiếu ngân hàng dẫn dắt thị trường", link: "https://cafef.vn", description: "Nhóm cổ phiếu ngân hàng tiếp tục thu hút dòng tiền với kỳ vọng tăng trưởng lợi nhuận.", pubDate: new Date().toISOString() },
];

// Danh sách Proxy để xoay vòng (Tránh bị chặn)
const PROXIES = [
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy?quest=',
  'https://api.allorigins.win/raw?url='
];

// Nguồn tin (Ưu tiên CafeF, backup VnEconomy)
const RSS_SOURCES = [
  'https://cafef.vn/thi-truong-chung-khoan.rss',
  'https://vneconomy.vn/rss/chung-khoan.rss'
];

const RSSFeed = () => {
  const [items, setItems] = useState(FALLBACK_NEWS);
  const [loading, setLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [currentSource, setCurrentSource] = useState('CafeF');
  const [readingLoading, setReadingLoading] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    let success = false;

    // Chiến thuật: Thử từng cặp (Proxy + URL)
    for (const rssUrl of RSS_SOURCES) {
      if (success) break;
      
      for (const proxy of PROXIES) {
        try {
          const targetUrl = proxy + encodeURIComponent(rssUrl);
          console.log('Trying:', targetUrl);
          
          const response = await fetch(targetUrl);
          if (!response.ok) throw new Error('Proxy error');
          
          const text = await response.text();
          // Kiểm tra xem có phải XML hợp lệ không
          if (!text.includes('<rss') && !text.includes('<feed')) throw new Error('Invalid XML');

          const parser = new DOMParser();
          const xml = parser.parseFromString(text, "text/xml");
          const itemNodes = xml.querySelectorAll("item");
          
          if (itemNodes.length > 0) {
            const news = Array.from(itemNodes).slice(0, 10).map(item => {
              const descriptionHtml = item.querySelector("description")?.textContent || "";
              const imgMatch = descriptionHtml.match(/src=["'](.*?)["']/);
              const cleanDesc = descriptionHtml.replace(/<[^>]*>/g, "").trim();

              return {
                title: item.querySelector("title")?.textContent || "Tin tức",
                link: item.querySelector("link")?.textContent || "#",
                pubDate: item.querySelector("pubDate")?.textContent,
                description: cleanDesc.substring(0, 180) + "...",
                image: imgMatch ? imgMatch[1] : null,
                content: null // Fetch nội dung sau khi click
              };
            });
            
            setItems(news);
            setIsLive(true);
            setCurrentSource(rssUrl.includes('cafef') ? 'CafeF' : 'VnEconomy');
            success = true;
            break; // Thoát vòng lặp proxy
          }
        } catch (err) {
          console.warn(`Failed with ${proxy}:`, err);
        }
      }
    }

    if (!success) {
      console.error('All proxies failed');
      setIsLive(false);
    }
    setLoading(false);
  };

  const handleReadArticle = async (article) => {
    setSelectedArticle(article);
    if (!article.fullContent) {
      setReadingLoading(true);
      let success = false;

      const READ_PROXIES = [
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?'
      ];

      for (const proxy of READ_PROXIES) {
        if (success) break;
        try {
          const targetUrl = proxy + encodeURIComponent(article.link) + (proxy.includes('allorigins') ? `&t=${Date.now()}` : '');
          console.log('Reading via:', proxy);
          
          const response = await fetch(targetUrl);
          if (!response.ok) throw new Error('Proxy error');
          
          const html = await response.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          
          let contentEl = doc.querySelector('.detail-content') || 
                          doc.querySelector('#mainContent') || 
                          doc.querySelector('.content-detail') ||
                          doc.querySelector('article');

          if (contentEl) {
            const junk = contentEl.querySelectorAll('script, style, iframe, .box-tin-lien-quan, .relate-container, .link-content-footer, .tag, #tin-lien-quan-detail');
            junk.forEach(el => el.remove());
            
            const allEls = contentEl.querySelectorAll('*');
            allEls.forEach(el => el.removeAttribute('style'));

            const images = contentEl.querySelectorAll('img');
            images.forEach(img => {
                if (img.dataset.src) img.src = img.dataset.src;
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
            });

            setSelectedArticle(prev => ({ ...prev, fullContent: contentEl.innerHTML }));
            success = true;
          }
        } catch (err) {
          console.warn(`Reader failed with proxy ${proxy}`, err);
        }
      }

      if (!success) {
         setSelectedArticle(prev => ({ ...prev, fullContent: `<p>Không thể tải nội dung chi tiết (Bị chặn). <br/>Vui lòng bấm nút bên dưới để đọc trên trang gốc.</p>` }));
      }
      setReadingLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 10 * 60 * 1000); // 10 phút
    return () => clearInterval(interval);
  }, []);

  const formatTime = (dateStr) => {
    try {
      const diff = Math.floor((new Date() - new Date(dateStr)) / 60000);
      if (diff < 1) return 'Vừa xong';
      if (diff < 60) return `${diff} phút`;
      if (diff < 1440) return `${Math.floor(diff / 60)} giờ`;
      return `${Math.floor(diff / 1440)} ngày`;
    } catch { return ''; }
  };

  return (
    <>
      <div className="bg-stoic-card p-6 rounded-2xl border border-stoic-accent">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xs font-bold text-stoic-text uppercase tracking-widest flex items-center gap-2">
            <TrendingUp size={16} className="text-stoic-safe" />
            Tin Tài Chính ({currentSource})
            <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded ${isLive ? 'bg-green-500/20 text-green-500' : 'bg-gray-700 text-gray-400'}`}>
              {isLive ? 'LIVE' : 'OFFLINE'}
            </span>
          </h3>
          <button 
            onClick={fetchNews}
            disabled={loading}
            className="p-1.5 rounded-lg hover:bg-stoic-bg text-stoic-text hover:text-white"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {loading && items.length === 0 ? (
            <div className="py-8 text-center text-stoic-text animate-pulse">Đang tải...</div>
          ) : (
            items.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleReadArticle(item)}
                className="group p-4 rounded-xl bg-stoic-bg/40 hover:bg-stoic-bg cursor-pointer border border-transparent hover:border-stoic-accent"
              >
                <h4 className="font-medium text-stoic-light group-hover:text-white text-sm leading-snug line-clamp-2 mb-2">
                  {item.title}
                </h4>
                <p className="text-xs text-stoic-text line-clamp-2 mb-2 opacity-70">
                  {item.description?.substring(0, 120)}...
                </p>
                <div className="flex items-center justify-between text-xs text-stoic-text">
                  <span className="text-stoic-safe flex items-center gap-1">
                    <BookOpen size={12} />
                    Đọc ngay
                  </span>
                  <span>{formatTime(item.pubDate)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal Reader */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-stoic-card rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden border border-stoic-accent flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-stoic-accent flex justify-between items-start">
              <div className="flex-1 pr-4">
                <h2 className="text-xl font-bold text-white leading-tight mb-2">
                  {selectedArticle.title}
                </h2>
                <span className="text-xs text-stoic-text">
                  CafeF • {formatTime(selectedArticle.pubDate)} trước
                </span>
              </div>
              <button 
                onClick={() => setSelectedArticle(null)}
                className="p-2 rounded-lg hover:bg-stoic-bg text-stoic-text hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {selectedArticle.image && (
                <img 
                  src={selectedArticle.image} 
                  alt="" 
                  className="w-full h-48 object-cover rounded-xl mb-6"
                />
              )}
              <p className="text-stoic-light leading-relaxed text-base mb-6 whitespace-pre-line">
                {selectedArticle.content || selectedArticle.description}
              </p>
              <div className="bg-stoic-bg/50 p-4 rounded-xl border border-stoic-accent">
                <p className="text-sm text-stoic-text mb-3">
                  💡 Đây là tóm tắt từ RSS. Để đọc đầy đủ:
                </p>
                <a 
                  href={selectedArticle.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-stoic-safe/20 text-stoic-safe rounded-lg hover:bg-stoic-safe/30 text-sm font-medium"
                >
                  <ExternalLink size={16} />
                  Đọc bài đầy đủ trên CafeF
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
      `}</style>
    </>
  );
};

export default RSSFeed;
