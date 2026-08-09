import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chats from "./pages/Chats";
import Profile from "./pages/Profile";
import PublicProfile from "./pages/PublicProfile";
import ActivityCenter from "./pages/ActivityCenter";
import CreateRequest from "./pages/CreateRequest";
import FindingMatch from "./pages/FindingMatch";
import FindRequests from "./pages/FindRequests";
import Chat from "./pages/Chat";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Layout from "./components/Layout";

function App() {


  return (
    <>
      <Routes>
        {/* Protected Routes with Layout */}
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<PublicProfile />} />
          <Route path="/activity" element={<ActivityCenter />} />
          <Route path="/create-request" element={<CreateRequest />} />
          <Route path="/find-requests" element={<FindRequests />} />
          <Route path="/finding-match" element={<FindingMatch />} />
        </Route>

        <Route
          path="/chat/:matchId"
          element={
            <PrivateRoute>
              <Chat />
            </PrivateRoute>
          }
        />

        {/* Public/Guest Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
