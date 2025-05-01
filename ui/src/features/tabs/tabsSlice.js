// src/features/tabs/tabsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTab1Data, fetchTab2Data, fetchTab3Data } from "../../api/services";

export const fetchTab1 = createAsyncThunk(
  "tabs/fetchTab1",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchTab1Data();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTab2 = createAsyncThunk(
  "tabs/fetchTab2",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchTab2Data();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTab3 = createAsyncThunk(
  "tabs/fetchTab3",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchTab3Data();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  tab1: {
    data: null,
    loading: false,
    error: null,
  },
  tab2: {
    data: null,
    loading: false,
    error: null,
  },
  tab3: {
    data: null,
    loading: false,
    error: null,
  },
  activeTab: "tab1",
};

const tabsSlice = createSlice({
  name: "tabs",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    clearTabsErrors: (state) => {
      state.tab1.error = null;
      state.tab2.error = null;
      state.tab3.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Tab 1
      .addCase(fetchTab1.pending, (state) => {
        state.tab1.loading = true;
      })
      .addCase(fetchTab1.fulfilled, (state, action) => {
        state.tab1.loading = false;
        state.tab1.data = action.payload;
        state.tab1.error = null;
      })
      .addCase(fetchTab1.rejected, (state, action) => {
        state.tab1.loading = false;
        state.tab1.error = action.payload;
      })
      
      // Tab 2
      .addCase(fetchTab2.pending, (state) => {
        state.tab2.loading = true;
      })
      .addCase(fetchTab2.fulfilled, (state, action) => {
        state.tab2.loading = false;
        state.tab2.data = action.payload;
        state.tab2.error = null;
      })
      .addCase(fetchTab2.rejected, (state, action) => {
        state.tab2.loading = false;
        state.tab2.error = action.payload;
      })
      
      // Tab 3
      .addCase(fetchTab3.pending, (state) => {
        state.tab3.loading = true;
      })
      .addCase(fetchTab3.fulfilled, (state, action) => {
        state.tab3.loading = false;
        state.tab3.data = action.payload;
        state.tab3.error = null;
      })
      .addCase(fetchTab3.rejected, (state, action) => {
        state.tab3.loading = false;
        state.tab3.error = action.payload;
      });
  },
});

export const { setActiveTab, clearTabsErrors } = tabsSlice.actions;
export default tabsSlice.reducer;