// src/components/common/Sidebar.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { setActiveTab } from "../../features/tabs/tabsSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { activeTab } = useSelector((state) => state.tabs);

  const handleTabClick = (tabId) => {
    dispatch(setActiveTab(tabId));
  };

  if (!sidebarOpen) {
    return null;
  }

  return (
    <div className="bg-gray-900 text-white w-64 p-4 h-full">
      <h2 className="text-xl font-bold mb-6">Navigation</h2>
      <nav>
        <ul>
          <li className="mb-2">
            <NavLink 
              to="/dashboard/tab1" 
              className={`block p-2 rounded ${activeTab === "tab1" ? "bg-blue-600" : "hover:bg-gray-800"}`}
              onClick={() => handleTabClick("tab1")}
            >
              Tab 1
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink 
              to="/dashboard/tab2" 
              className={`block p-2 rounded ${activeTab === "tab2" ? "bg-blue-600" : "hover:bg-gray-800"}`}
              onClick={() => handleTabClick("tab2")}
            >
              Tab 2
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink 
              to="/dashboard/tab3" 
              className={`block p-2 rounded ${activeTab === "tab3" ? "bg-blue-600" : "hover:bg-gray-800"}`}
              onClick={() => handleTabClick("tab3")}
            >
              Tab 3
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
