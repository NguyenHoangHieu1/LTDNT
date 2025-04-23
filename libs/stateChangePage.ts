import { create } from 'zustand';

type NavigationStore = {
  data: Record<string, any>;
  setData: (key: string, data: any) => void;
  getData: <T>(key: string) => T;
  clearData: (key: string) => void;
};

export const useNavigationStore = create<NavigationStore>((set, get) => ({
  data: {},

  setData: (key, data) => {
    console.log(`[setData] key: ${key}, data:`, data);
    set((state) => {
      const updatedData = { ...state.data, [key]: data };
      console.log('[setData] updated data:', updatedData);
      return { data: updatedData };
    });
  },

  getData: (key) => {
    const value = get().data[key];
    console.log(`[getData] key: ${key}, value:`, value);
    return value;
  },

  clearData: (key) => {
    set((state) => {
      const newData = { ...state.data };
      delete newData[key];
      console.log(`[clearData] key: ${key} removed`);
      console.log('[clearData] updated data:', newData);
      return { data: newData };
    });
  },
}));

