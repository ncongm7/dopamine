// Gambling Recovery API Service
// Connect to Google Apps Script backend for gambling recovery tracking

const GAMBLE_API_URL = 'https://script.google.com/macros/s/AKfycbxDAcLBw8tKilnnhQOmKIUe0xF_9igpax0F1Y2OMDsA_nxzdJDPHRaqVC5cY_TPdP6hzQ/exec';

// Format money for display
export const formatMoney = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount);
};

// Get gambling recovery statistics
export const getGambleStats = async () => {
  try {
    const response = await fetch(`${GAMBLE_API_URL}?action=get_gamble_stats`, {
      method: 'GET',
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Response text:', text);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    console.log('Raw response:', text);
    
    const data = JSON.parse(text);
    return data;
  } catch (error) {
    console.error('Error fetching gamble stats:', error);
    throw error;
  }
};

// Check-in: Log daily recovery status
export const checkInGamble = async (status, moneySaved = 0, smallWinNote = '', urgeCount = 0) => {
  try {
    const params = new URLSearchParams({
      action: 'gamble_check_in',
      status,
      money_saved: moneySaved.toString(),
      small_win_note: smallWinNote,
      urge_count: urgeCount.toString()
    });

    const response = await fetch(`${GAMBLE_API_URL}?${params.toString()}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking in:', error);
    throw error;
  }
};

// Record urge without breaking streak
export const recordUrge = async () => {
  try {
    const response = await fetch(`${GAMBLE_API_URL}?action=record_urge`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error recording urge:', error);
    throw error;
  }
};

// Update total money lost (one-time setup)
export const updateTotalLost = async (amount) => {
  try {
    const params = new URLSearchParams({
      action: 'update_total_lost',
      amount: amount.toString()
    });

    const response = await fetch(`${GAMBLE_API_URL}?${params.toString()}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating total lost:', error);
    throw error;
  }
};

// Get weekly analysis report
export const getWeeklyReport = async () => {
  try {
    const response = await fetch(`${GAMBLE_API_URL}?action=get_weekly_report`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weekly report:', error);
    throw error;
  }
};

// Calculate recovery progress
export const calculateRecoveryProgress = (totalLost, totalSaved) => {
  if (!totalLost || totalLost === 0) return null;
  
  const percentage = (totalSaved / totalLost) * 100;
  const remaining = totalLost - totalSaved;
  
  return {
    percentage: Math.min(percentage, 100),
    remaining: Math.max(remaining, 0),
    recovered: totalSaved
  };
};

// Calculate days to recovery
export const calculateDaysToRecovery = (totalLost, totalSaved, daysClean) => {
  if (!totalLost || !daysClean || daysClean === 0) return null;
  
  const avgDailySavings = totalSaved / daysClean;
  if (avgDailySavings === 0) return null;
  
  const remaining = totalLost - totalSaved;
  const daysToRecovery = Math.ceil(remaining / avgDailySavings);
  
  return daysToRecovery > 0 ? daysToRecovery : 0;
};

// Test API connection
export const testGambleAPI = async () => {
  console.log('🎲 Testing Gamble Recovery API...');
  console.log('API URL:', GAMBLE_API_URL);
  
  try {
    const stats = await getGambleStats();
    console.log('✅ API Connection successful!');
    console.log('Stats:', stats);
    return stats;
  } catch (error) {
    console.error('❌ API Connection failed:', error);
    throw error;
  }
};
