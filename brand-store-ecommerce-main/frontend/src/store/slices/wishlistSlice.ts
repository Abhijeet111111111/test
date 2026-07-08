import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WishlistState {
  items: string[]; // product IDs
  count: number;
}

const loadWishlist = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem('brand-store-wishlist');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveWishlist = (items: string[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('brand-store-wishlist', JSON.stringify(items));
  }
};

const initialState: WishlistState = {
  items: [],
  count: 0,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    initializeWishlist(state) {
      state.items = loadWishlist();
      state.count = state.items.length;
    },
    toggleWishlistItem(state, action: PayloadAction<string>) {
      const index = state.items.indexOf(action.payload);
      if (index > -1) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
      state.count = state.items.length;
      saveWishlist(state.items);
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.items = state.items.filter((id) => id !== action.payload);
      state.count = state.items.length;
      saveWishlist(state.items);
    },
    clearWishlist(state) {
      state.items = [];
      state.count = 0;
      saveWishlist([]);
    },
  },
});

export const { initializeWishlist, toggleWishlistItem, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
