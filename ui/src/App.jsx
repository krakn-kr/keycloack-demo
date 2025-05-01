// src/App.jsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { initKeycloak } from "./features/auth/authSlice";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Components
import ProtectedRoute from "./components/common/ProtectedRoute";
import Tab1Content from "./components/tabs/Tab1Content";
import Tab2Content from "./components/tabs/Tab2Content";
import Tab3Content from "./components/tabs/Tab3Content";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initKeycloak());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="" element={<Navigate to="tab1" replace />} />
          <Route path="tab1" element={<Tab1Content />} />
          <Route path="tab2" element={<Tab2Content />} />
          <Route path="tab3" element={<Tab3Content />} />
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;