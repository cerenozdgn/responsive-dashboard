import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/header/header";
import Sidebar from "./components/sidebar/sidebar";
import Tools from "./components/tools/tools";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`${darkMode ? "dark" : ""} font-arima`}>
      <Header
        toggleDarkMode={toggleDarkMode}
        darkMode={darkMode}
        toggleSidebar={toggleSidebar}
      />
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <Router>
        <div>
          <Routes>
            <Route
              path="/tools"
              element={
                <Tools
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                  isSidebarOpen={isSidebarOpen}
                  toggleSidebar={toggleSidebar}
                />
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
