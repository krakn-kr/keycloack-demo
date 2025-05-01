// src/components/common/Header.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { toggleSidebar } from "../../features/ui/uiSlice";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={handleToggleSidebar}
            className="p-1 mr-4 rounded hover:bg-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>
        <div className="flex items-center">
          <div className="mr-4 text-sm">
            Welcome, {user?.username || "User"}
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
