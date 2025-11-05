import axios from 'axios';
import { supabase } from '../lib/supabase';

const apiClient = axios.create({
  baseURL: 'http://localhost:3002/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add Supabase auth token to requests
apiClient.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

// Handle network errors gracefully
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if it's a network error (offline)
    if (!error.response) {
      error.message = 'You are currently offline. Please check your internet connection.';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

