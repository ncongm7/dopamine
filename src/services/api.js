import axios from 'axios';

// Replace with actual Google Apps Script Web App URL
const API_URL = 'https://script.google.com/macros/s/AKfycbwWrbM3lx6WblSWtaCUlm34VB0NWTzHU8ZcGGDf3AI-jCYVqMBs5K1jha0Xf93kX4guoA/exec'; 
const USE_MOCK = false; // Set to false when backend is ready

const mockData = {
  currentStreak: 12,
  maxStreak: 45,
  history: [
    ['2023-10-25', 'clean'],
    ['2023-10-26', 'clean'],
    ['2023-10-27', 'clean'],
    ['2023-10-28', 'relapse'],
    ['2023-10-29', 'clean'],
    ['2023-10-30', 'clean'],
    ['2023-10-31', 'clean'],
  ]
};

export const getStats = async () => {
  if (USE_MOCK) {
    return new Promise(resolve => setTimeout(() => resolve(mockData), 500));
  }
  const response = await axios.get(`${API_URL}?action=get_stats`);
  // Backend returns { status: "success", data: { currentStreak, maxStreak, history } }
  return response.data.data || response.data;
};

export const checkIn = async (status) => {
  if (USE_MOCK) {
    console.log(`[MOCK] Check-in: ${status}`);
    if (status === 'relapse') {
        mockData.currentStreak = 0;
    } else {
        mockData.currentStreak += 1;
        if (mockData.currentStreak > mockData.maxStreak) mockData.maxStreak = mockData.currentStreak;
    }
    return new Promise(resolve => setTimeout(() => resolve({ status: 'success' }), 500));
  }
  
  // Use fetch with URL params to avoid CORS issues with POST
  const response = await fetch(`${API_URL}?action=check_in&status=${status}`, {
    method: 'GET', // Google Apps Script handles both GET and POST the same way
  });
  const data = await response.json();
  return data;
};
