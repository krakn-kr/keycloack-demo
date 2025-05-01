// src/components/common/ProtectedRoute.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { initKeycloak } from "../../features/auth/authSlice";
import Loader from "./Loader";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      dispatch(initKeycloak());
    }
  }, [isAuthenticated, loading, dispatch]);

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated) {
    // Redirect to login but remember where they were trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;