// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import keycloak from "../../utils/keycloakConfig";

// Async thunk for initializing Keycloak
export const initKeycloak = createAsyncThunk(
  "auth/initKeycloak",
  async (_, { rejectWithValue }) => {
    try {
      const authenticated = await keycloak.init({
        onLoad: "check-sso",
        silentCheckSsoRedirectUri: window.location.origin + "/silent-check-sso.html",
        pkceMethod: "S256",
      });

      if (authenticated) {
        return {
          isAuthenticated: true,
          token: keycloak.token,
          refreshToken: keycloak.refreshToken,
          user: {
            id: keycloak.subject,
            username: keycloak.tokenParsed.preferred_username,
            roles: keycloak.realmAccess?.roles || [],
          },
        };
      }

      return { isAuthenticated: false };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for login
export const login = createAsyncThunk("auth/login", async (_, { rejectWithValue }) => {
  try {
    await keycloak.login();
    return true; // This will redirect the page, so this return won't actually happen
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async thunk for logout
export const logout = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await keycloak.logout();
    return true; // This will redirect the page
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async thunk for token refresh
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const refreshed = await keycloak.updateToken(30);
      
      if (refreshed) {
        return {
          token: keycloak.token,
          refreshToken: keycloak.refreshToken,
        };
      }
      
      return null; // Token was still valid
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  isAuthenticated: false,
  token: null,
  refreshToken: null,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // initKeycloak
      .addCase(initKeycloak.pending, (state) => {
        state.loading = true;
      })
      .addCase(initKeycloak.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = action.payload.isAuthenticated;
        if (action.payload.isAuthenticated) {
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken;
          state.user = action.payload.user;
        }
      })
      .addCase(initKeycloak.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // login states
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // logout states
      .addCase(logout.fulfilled, (state) => {
        return initialState;
      })
      
      // refreshToken
      .addCase(refreshToken.fulfilled, (state, action) => {
        if (action.payload) {
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken;
        }
      })
      .addCase(refreshToken.rejected, (state) => {
        return initialState;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;