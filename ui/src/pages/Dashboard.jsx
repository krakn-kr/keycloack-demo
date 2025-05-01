// src/pages/Dashboard.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import { setActiveTab } from "../features/tabs/tabsSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { activeTab } = useSelector((state) => state.tabs);
  const { sidebarOpen } = useSelector((state) => state.ui);

  // Set active tab based on URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("tab1")) {
      dispatch(setActiveTab("tab1"));
    } else if (path.includes("tab2")) {
      dispatch(setActiveTab("tab2"));
    } else if (path.includes("tab3")) {
      dispatch(setActiveTab("tab3"));
    } else if (path === "/dashboard") {
      // If at root dashboard path, navigate to active tab
      navigate(`/dashboard/${activeTab}`, { replace: true });
    }
  }, [location.pathname, dispatch, navigate, activeTab]);

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;