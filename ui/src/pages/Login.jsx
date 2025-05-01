// src/pages/Login.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { login, initKeycloak } from "../features/auth/authSlice";
import Loader from "../components/common/Loader";

const Login = () => {
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    dispatch(initKeycloak());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleLogin = () => {
    dispatch(login());
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome to Dashboard
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to access your account
          </p>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <div className="mt-8">
          <button
            onClick={handleLogin}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sign in with Keycloak
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;