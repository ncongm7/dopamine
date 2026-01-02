import React, { useEffect, useState } from 'react';
import AppLayout from './components/Layout/AppLayout';
import StreakStats from './components/Dashboard/StreakStats';
import CheckInWidget from './components/Dashboard/CheckInWidget';
import NeuroAnalysis from './components/Dashboard/NeuroAnalysis';
import RSSFeed from './components/Feed/RSSFeed';
import FinanceModule from './components/Finance/FinanceModule';
import ChatGPTModule from './components/ChatGPT/ChatGPTModule';
import InvestmentHub from './components/Investment/InvestmentHub';
import { getStats } from './services/api';
import { testConnection } from './utils/testAPI';
import { testFinanceAPI } from './services/financeApi';

function App() {
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('dashboard'); // dashboard, finance, chatgpt, learning, settings
  const [data, setData] = useState({
    currentStreak: 0,
    maxStreak: 0,
    history: []
  });
  
  // Cache finance data to prevent re-fetching
  const [financeData, setFinanceData] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const stats = await getStats();
      setData({
        currentStreak: stats.currentStreak || 0,
        maxStreak: stats.maxStreak || 0,
        history: stats.history || []
      });
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Make test functions available in console
    window.testAPI = testConnection;
    window.testFinanceAPI = testFinanceAPI;
    window.testInvestmentAPI = async () => {
      const { testInvestmentAPI } = await import('./services/investmentApi');
      return testInvestmentAPI();
    };
    console.log('💡 Tip: Run window.testAPI() to test Dopamine API');
    console.log('💰 Tip: Run window.testFinanceAPI() to test Finance API');
    console.log('📈 Tip: Run window.testInvestmentAPI() to test Investment API');
  }, []);

  if (loading && activeView === 'dashboard') {
    return (
      <div className="h-screen w-full bg-stoic-bg flex items-center justify-center text-stoic-text">
        <div className="animate-pulse tracking-widest text-sm">LOADING NEURAL INTERFACE...</div>
      </div>
    );
  }

  return (
    <AppLayout activeView={activeView} onViewChange={setActiveView}>
      {activeView === 'dashboard' && (
        <>
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Neural Status</h1>
            <p className="text-stoic-text">Dopamine Baseline: <span className="text-stoic-safe">Recovering</span></p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Stats & Check-in */}
            <div className="lg:col-span-2 space-y-8">
              <StreakStats current={data.currentStreak} max={data.maxStreak} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <CheckInWidget onCheckIn={fetchData} />
                 {/* Future scalability: Graph or other widget here */}
              </div>

              <NeuroAnalysis 
                currentStreak={data.currentStreak} 
                maxStreak={data.maxStreak}
                history={data.history}
              />
            </div>

            {/* Right Column: Feed */}
            <div className="lg:col-span-1">
              <RSSFeed />
            </div>
          </div>
        </>
      )}

      {activeView === 'finance' && (
        <FinanceModule 
          cachedData={financeData} 
          onDataLoaded={setFinanceData} 
        />
      )}

      {activeView === 'investment' && <InvestmentHub />}

      {activeView === 'chatgpt' && <ChatGPTModule />}

      {activeView === 'learning' && (
        <div className="flex items-center justify-center h-full">
          <p className="text-stoic-text text-lg">Learning Module - Coming Soon</p>
        </div>
      )}

      {activeView === 'settings' && (
        <div className="flex items-center justify-center h-full">
          <p className="text-stoic-text text-lg">Settings - Coming Soon</p>
        </div>
      )}
    </AppLayout>
  );
}

export default App;

