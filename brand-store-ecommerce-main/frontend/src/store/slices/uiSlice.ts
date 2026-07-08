import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  searchOpen: boolean;
  mobileMenuOpen: boolean;
  filterOpen: boolean;
  quickViewProduct: string | null;
}

const initialState: UIState = {
  searchOpen: false,
  mobileMenuOpen: false,
  filterOpen: false,
  quickViewProduct: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSearch(state) {
      state.searchOpen = !state.searchOpen;
    },
    setSearchOpen(state, action: PayloadAction<boolean>) {
      state.searchOpen = action.payload;
    },
    toggleMobileMenu(state) {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMobileMenuOpen(state, action: PayloadAction<boolean>) {
      state.mobileMenuOpen = action.payload;
    },
    toggleFilter(state) {
      state.filterOpen = !state.filterOpen;
    },
    setFilterOpen(state, action: PayloadAction<boolean>) {
      state.filterOpen = action.payload;
    },
    setQuickViewProduct(state, action: PayloadAction<string | null>) {
      state.quickViewProduct = action.payload;
    },
  },
});

export const { toggleSearch, setSearchOpen, toggleMobileMenu, setMobileMenuOpen, toggleFilter, setFilterOpen, setQuickViewProduct } = uiSlice.actions;
export default uiSlice.reducer;
