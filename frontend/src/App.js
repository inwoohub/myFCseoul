import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 각 페이지 컴포넌트 import
import Home from "./pages/MainPage";
import Login from './pages/Login';
import SchedulePage from "./pages/SchedulePage";

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Schedule" element={<SchedulePage />} />
      </Routes>
    </Router>
  );
}


export default App;
