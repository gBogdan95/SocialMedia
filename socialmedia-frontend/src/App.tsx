import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import TopNavbar from "./components/navbars/TopNavbar";
import Login from "./pages/Login";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <TopNavbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
