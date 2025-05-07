import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// IMPORTANT: Replace with your actual server IP address or hostname
// For Android emulator, use 10.0.2.2 to access localhost
// For iOS simulator, use localhost
// For physical devices, use your computer's IP address on the same network
const API_URL = 'http://10.0.2.2:5000/api'; // Android emulator example
// const API_URL = 'http://192.168.1.14:5000/api'; // Android phone example

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error getting token:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    // Handle API errors
    const errorMessage = error.response?.data?.message || 'An error occurred';
    console.error('API Error:', errorMessage, error.response?.status);
    return Promise.reject(new Error(errorMessage));
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (fullName: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { fullName, email, password });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // Test connection to server
  testConnection: async () => {
    try {
      const response = await api.get('/test');
      return response.data;
    } catch (error) {
      console.error('Test connection failed:', error);
      throw error;
    }
  },

  updateProfile: async (fullName: string, email: string) => {
    const response = await api.put('/auth/profile', { fullName, email });
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Password reset
  requestPasswordReset: async (email: string) => {
    const response = await api.post('/password-reset/request', { email });
    return response.data;
  },

  validateResetToken: async (token: string) => {
    const response = await api.get(`/password-reset/validate/${token}`);
    return response.data;
  },

  resetPassword: async (token: string, password: string) => {
    const response = await api.post('/password-reset/reset', { token, password });
    return response.data;
  },

  deleteAccount: async (userId: string) => {
    const response = await api.delete(`/auth/${userId}`);
    return response.data;
  },
};

const generatePcPartsAPI = (endpoint: string) => ({
  getAll: async () => {
    const response = await api.get(`/${endpoint}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/${endpoint}/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await api.post(`/${endpoint}`, data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/${endpoint}/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/${endpoint}/${id}`);
    return response.data;
  },

  getPaginated: async (page: number = 1, limit: number = 10) => {
    const response = await api.get(`/${endpoint}/paginated?page=${page}&limit=${limit}`);
    return response.data;
  },
});

export const cpuAPI = generatePcPartsAPI('cpu');
export const gpuAPI = generatePcPartsAPI('gpu');
export const motherboardAPI = generatePcPartsAPI('motherboard');
export const driveAPI = generatePcPartsAPI('drive');
export const memoryAPI = generatePcPartsAPI('memory');
export const keyboardAPI = generatePcPartsAPI('keyboard');
export const mouseAPI = generatePcPartsAPI('mouse');

// Products API
export const productsAPI = {
  getProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  getProductById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (productData: any) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  updateProduct: async (id: string, productData: any) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  uploadImage: async (uri: string) => {
    // Create form data for image upload
    const formData = new FormData();

    // Extract filename from uri
    const filename = uri.split('/').pop() || 'image.jpg';

    // Infer the type of the image
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('image', {
      uri,
      name: filename,
      type,
    } as any);

    // Use axios directly with custom config for multipart/form-data
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${await AsyncStorage.getItem('userToken')}`,
      },
    });

    return response.data.imageUrl;
  },
};
