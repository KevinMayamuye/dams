import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function PrivateRoute({ children }) {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <p>Loading...</p>;
  if (!user || user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
