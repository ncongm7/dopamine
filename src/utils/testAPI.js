// Test utility - Run this in browser console to test API
// Usage: import { testConnection } from './utils/testAPI'
// Then call: testConnection()

const API_URL = 'https://script.google.com/macros/s/AKfycbwWrbM3lx6WblSWtaCUlm34VB0NWTzHU8ZcGGDf3AI-jCYVqMBs5K1jha0Xf93kX4guoA/exec';

export const testConnection = async () => {
  console.log('🔍 Testing API connection...');
  console.log('URL:', API_URL);
  
  try {
    console.log('📡 Sending GET request...');
    const response = await fetch(`${API_URL}?action=get_stats`);
    
    console.log('✅ Response received!');
    console.log('Status:', response.status);
    
    const data = await response.json();
    console.log('📦 Data:', data);
    
    if (data.currentStreak !== undefined) {
      console.log('✅ API is working correctly!');
      console.log('Current Streak:', data.currentStreak);
      console.log('Max Streak:', data.maxStreak);
      console.log('History entries:', data.history?.length || 0);
    } else {
      console.warn('⚠️ Unexpected response format:', data);
    }
    
    return data;
  } catch (error) {
    console.error('❌ API Test Failed:', error);
    console.error('Error details:', error.message);
    
    if (error.message.includes('CORS')) {
      console.log('💡 Fix: Make sure Google Apps Script is deployed with "Who has access: Anyone"');
    }
    
    throw error;
  }
};

// Auto-run test if in development
if (import.meta.env.DEV) {
  console.log('🚀 API Test utility loaded. Run testConnection() to test.');
}
