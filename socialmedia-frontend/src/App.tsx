import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AuthProvider } from "./contexts/AuthContext";
import MainLayout from "./components/MainLayout";
import TopNavbar from "./components/TopNavbar";
import Explore from "./pages/Explore";
import Groups from "./pages/Groups";
import CreatePost from "./pages/CreatePost";
import People from "./pages/People";
import Shop from "./pages/Shop";
import Settings from "./pages/Settings";
import { RightContentProvider } from "./contexts/RightContentContext";

function App() {
  return (
    <AuthProvider>
      <RightContentProvider>
        <BrowserRouter>
          <TopNavbar />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={<MainLayout />}>
              <Route path="explore" element={<Explore />} />
              <Route path="groups" element={<Groups />} />
              <Route path="create-post" element={<CreatePost />} />
              <Route path="people" element={<People />} />
              <Route path="shop" element={<Shop />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </RightContentProvider>
    </AuthProvider>
  );
}

export default App;
