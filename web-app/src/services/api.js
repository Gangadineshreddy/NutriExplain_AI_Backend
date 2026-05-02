import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Auth
  register: (data) => apiClient.post('/register', data),
  login: (data) => apiClient.post('/login', data),
  sendOtp: (data) => apiClient.post('/send-otp', data),
  verifyOtp: (data) => apiClient.post('/verify-otp', data),
  resetPassword: (data) => apiClient.post('/reset-password', data),

  // Profile Setup
  addHealthProfile: (data) => apiClient.post('/add-health-profile', data),
  addCondition: (data) => apiClient.post('/add-condition', data),
  saveHealthCondition: (data) => apiClient.post('/save-health-condition', data),
  setNutritionLimit: (data) => apiClient.post('/set-nutrition-limit', data),
  
  // Profile Management
  getProfile: (userId) => apiClient.get(`/get-profile?user_id=${userId}`),
  updateProfile: (data) => apiClient.post('/update-profile', data),
  uploadProfileImage: (formData) => apiClient.post('/upload-profile-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  // Scanning & Analysis
  getProductData: (data) => apiClient.post('/get-product-data', data),
  analyzeFood: (data) => apiClient.post('/analyze-food', data),
  aiPredict: (data) => apiClient.post('/ai-predict', data),
  saveScan: (data) => apiClient.post('/save-scan', data),
  getHistory: (userId) => apiClient.get(`/get-history?user_id=${userId}`)
};

export default api;
