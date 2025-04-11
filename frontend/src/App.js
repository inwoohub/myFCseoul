import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 각 페이지 컴포넌트 import
import Home from "./pages/MainPage";
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
      </Routes>
    </Router>
  );
}


export default App;
