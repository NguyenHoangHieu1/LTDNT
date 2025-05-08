import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { authAPI } from '~/libs/api';

interface User {
  _id: string;
  fullName: string;
  email: string;
  token: string;
  createdAt: Date;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;

  // Auth actions
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (fullName: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;

  // Profile actions
  updateProfile: (fullName: string, email: string, _id: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string, _id: string) => Promise<void>;

  // Session management
  refreshSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  error: null,

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const userData = await authAPI.login(email, password);

      // Save token to AsyncStorage
      await AsyncStorage.setItem('userToken', userData.token);
      set({
        user: userData,
        loading: false,
      });
      return userData;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to sign in',
        loading: false,
      });
    }
  },

  signUp: async (fullName: string, email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const userData = await authAPI.register(fullName, email, password);

      // Save token to AsyncStorage
      await AsyncStorage.setItem('userToken', userData.token);

      set({
        user: userData,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to sign up',
        loading: false,
      });
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null });

      // Remove token from AsyncStorage
      await AsyncStorage.removeItem('userToken');

      set({
        user: null,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to sign out',
        loading: false,
      });
    }
  },

  refreshSession: async () => {
    try {
      set({ loading: true });

      // Get token from AsyncStorage
      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        set({ user: null, loading: false });
        return;
      }

      try {
        // Verify token by getting user profile
        const profile = await authAPI.getProfile();

        set({
          user: {
            _id: profile._id,
            fullName: profile.fullName,
            email: profile.email,
            token,
            createdAt: profile.createdAt,
          },
          loading: false,
        });
      } catch (error) {
        // Token is invalid, remove it
        await AsyncStorage.removeItem('userToken');
        set({ user: null, loading: false });
      }
    } catch (error: any) {
      set({
        error: error.message || 'Failed to refresh session',
        loading: false,
      });
    }
  },

  updateProfile: async (fullName: string, email: string, _id: string) => {
    try {
      set({ loading: true, error: null });
      const userData = await authAPI.updateProfile(fullName, email, _id);

      // Update token in AsyncStorage if it changed
      await AsyncStorage.setItem('userToken', userData.token);

      set({
        user: userData,
        loading: false,
      });

      return userData;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to update profile',
        loading: false,
      });
      throw error;
    }
  },

  changePassword: async (currentPassword: string, newPassword: string, _id: string) => {
    try {
      set({ loading: true, error: null });
      await authAPI.changePassword(currentPassword, newPassword, _id);
      set({ loading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to change password',
        loading: false,
      });
      throw error;
    }
  },
}));
