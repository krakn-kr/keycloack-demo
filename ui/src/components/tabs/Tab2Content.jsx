// src/components/tabs/Tab2Content.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTab2 } from "../../features/tabs/tabsSlice";
import Loader from "../common/Loader";

const Tab2Content = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.tabs.tab2);

  useEffect(() => {
    if (!data && !loading) {
      dispatch(fetchTab2());
    }
  }, [dispatch, data, loading]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Tab 2</h2>
      {data ? (
        <div>
          {/* Render your tab 2 data here */}
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};

export default Tab2Content;