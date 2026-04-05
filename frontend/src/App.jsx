import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/theme.css";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import AdminDashboard from "./pages/dashboards/AdminDashboard.jsx";
import ClientDashboard from "./pages/dashboards/ClientDashboard.jsx";
import ProviderDashboard from "./pages/dashboards/ProviderDashboard.jsx";
import Conversations from "./pages/client/Conversations.jsx";
import IncomingRequests from "./pages/provider/IncomingRequests.jsx";
import UsersModeration from "./pages/admin/UsersModeration.jsx";
import ReviewsModeration from "./pages/admin/ReviewsModeration.jsx";

function HomeRedirect() {
  const { role, token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  if (role === "admin") return <Navigate to="/admin" replace />;
  if (role === "provider") return <Navigate to="/provider" replace />;
  return <Navigate to="/client" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRedirect/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />

          <Route path="/client" element={
            <ProtectedRoute roles={["client"]}><ClientDashboard/></ProtectedRoute>
          } />
          <Route path="/client/discover" element={<Navigate to="/client" replace />} />
          <Route path="/client/conversations" element={
            <ProtectedRoute roles={["client"]}><Conversations/></ProtectedRoute>
          } />

          <Route path="/provider" element={
            <ProtectedRoute roles={["provider"]}><ProviderDashboard/></ProtectedRoute>
          } />
          <Route path="/provider/requests" element={
            <ProtectedRoute roles={["provider"]}><IncomingRequests/></ProtectedRoute>
          } />
          <Route path="/provider/conversations" element={
            <ProtectedRoute roles={["provider"]}><Conversations/></ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute roles={["admin"]}><AdminDashboard/></ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute roles={["admin"]}><UsersModeration/></ProtectedRoute>
          } />
          <Route path="/admin/reviews" element={
            <ProtectedRoute roles={["admin"]}><ReviewsModeration/></ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}