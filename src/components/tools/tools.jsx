import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../header/header";
import Sidebar from "../sidebar/sidebar";

const Tools = ({ darkMode, toggleDarkMode, isSidebarOpen, toggleSidebar }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        let requestData = "";
        if (searchQuery.length < 3) {
          requestData = {
            min_score: 0,
            max_score: 10,
            page: currentPage,
            per_page: itemsPerPage,
            precondition_status: 2,
            token:
              "ZgxATvoKV2sOyP_nJtlZoybCiHMtFki147GlKWsnCfRpJpOB4RPeQITKbkYtlSliDAU0e6iuHvRK_3Fza1ez8A",
          };
        } else {
          requestData = {
            query: searchQuery,
            min_score: 0,
            max_score: 10,
            page: currentPage,
            per_page: itemsPerPage,
            precondition_status: 2,
            token:
              "ZgxATvoKV2sOyP_nJtlZoybCiHMtFki147GlKWsnCfRpJpOB4RPeQITKbkYtlSliDAU0e6iuHvRK_3Fza1ez8A",
          };
        }
        const response = await axios.post(
          "https://thingproxy.freeboard.io/fetch/https://api.s4e.io/api/scan/list",
          requestData,
          {
            headers: {
              "Content-Type": "application/json",
              accept: "application/json",
            },
          }
        );
        console.log("API Response:", response.data);

        if (response.data && response.data.value) {
          const filteredData = response.data.value.data.filter((item) =>
            selectedTypes.length === 0
              ? true
              : selectedTypes.some((type) =>
                  item.asset_type.split(",").includes(type)
                )
          );

          setData(filteredData);
          setTotalCount(response.data.value.total_count);
        }
      } catch (err) {
        console.log(err);
        setError("Veriler alınırken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchQuery, selectedTypes]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handleTypeSelection = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  useEffect(() => {
    const savedSearchQuery = localStorage.getItem("searchQuery") || "";
    const savedSelectedTypes =
      JSON.parse(localStorage.getItem("selectedTypes")) || [];
    const savedCurrentPage = Number(localStorage.getItem("currentPage")) || 1;

    setSearchQuery(savedSearchQuery);
    setSelectedTypes(savedSelectedTypes);
    setCurrentPage(savedCurrentPage);

    const savedFilteredData = JSON.parse(localStorage.getItem("filteredData"));
    if (savedFilteredData && Array.isArray(savedFilteredData)) {
      setData(savedFilteredData);
    }
  }, []);

  return (
    <div className={`${darkMode ? "dark" : ""} font-arima`}>
      <Header
        toggleDarkMode={toggleDarkMode}
        darkMode={darkMode}
        toggleSidebar={toggleSidebar}
      />

      <Sidebar isSidebarOpen={isSidebarOpen} />

      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } p-4 pt-20`}
      >
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700">
            <div className="relative">
              <input
                type="text"
                placeholder="Ara"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  localStorage.setItem("searchQuery", e.target.value);
                }}
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-80 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                Asset Type
              </button>
              {isDropdownOpen && (
                <div className="absolute z-10 mt-2 w-48 bg-white shadow-lg rounded-lg dark:bg-gray-700">
                  {["domain", "ipv4", "subdomain"].map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => handleTypeSelection(type)}
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <p className="text-center p-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg">
              Loading...
            </p>
          ) : error ? (
            <p className="text-center p-4 bg-red-100 dark:bg-red-800 text-red-500 dark:text-red-300 rounded-lg">
              {error}
            </p>
          ) : (
            <>
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3">Score</th>
                    <th className="px-6 py-3">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr
                      key={item.slug}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {item.mini_desc}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {item.score}
                      </td>
                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {item.asset_type}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-700">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg disabled:bg-gray-300 dark:disabled:bg-gray-600"
                >
                  Prev
                </button>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Sayfa {currentPage} / {totalPages}
                </p>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg disabled:bg-gray-300 dark:disabled:bg-gray-600"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tools;
