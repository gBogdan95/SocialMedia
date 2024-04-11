import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AuthProvider } from "./contexts/AuthContext";
import MainLayout from "./components/MainLayout";
import TopNavbar from "./components/TopNavbar";
import Posts from "./pages/Posts";
import Groups from "./pages/Groups";
import Users from "./pages/Users";
import Shop from "./pages/Shop";
import Settings from "./pages/Settings";
import { RightContentProvider } from "./contexts/RightContentContext";
import AuthListener from "./components/AuthListner";
import PostDetails from "./pages/PostDetails";
import ProfileDetails from "./pages/ProfileDetails";

function App() {
  return (
    <AuthProvider>
      <RightContentProvider>
        <BrowserRouter>
          <AuthListener />
          <TopNavbar />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={<MainLayout />}>
              <Route path="explore" element={<Posts />} />
              <Route path="post/:id" element={<PostDetails />} />
              <Route path="profile/:userId" element={<ProfileDetails />} />
              <Route path="groups" element={<Groups />} />
              <Route path="people" element={<Users />} />
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
