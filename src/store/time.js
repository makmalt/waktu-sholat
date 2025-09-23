import { create } from 'zustand';

export const useTimeStore = create((set) => ({
  time: null,
  fetchTime: async () => {
    const res = await fetch('https://api.myquran.com/v2/tools/time');
    const data = await res.json();
    set({ time: new Date(data.data.timestamp) });
  },
  tick: () => set((state) => ({ time: new Date(state.time.getTime() + 1000) })),
}));