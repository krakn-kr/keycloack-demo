
// src/api/services.js
import axiosInstance from "./axiosInstance";

// Tab 1 data service
export const fetchTab1Data = async () => {
  const response = await axiosInstance.get("/protected/tab1-data");
  return response.data;
};

// Tab 2 data service
export const fetchTab2Data = async () => {
  const response = await axiosInstance.get("/protected/tab2-data");
  return response.data;
};

// Tab 3 data service
export const fetchTab3Data = async () => {
  const response = await axiosInstance.get("/protected/tab3-data");
  return response.data;
};