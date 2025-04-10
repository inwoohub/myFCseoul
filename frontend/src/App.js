import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 각 페이지 컴포넌트 import
import Home from "./pages/MainPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}


export default App;
