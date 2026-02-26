import { useEffect, useContext } from "react";
import { getProfile } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user, setUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user || loading) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const loadProfile = async () => {
      try {
        const res = await getProfile(token);
        setUser(res.data);
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    loadProfile();
  }, [user, loading, setUser, navigate]);

  if (loading) return <h3>Loading...</h3>;
  if (!user) {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return <h3>Loading...</h3>;
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2>Dashboard</h2>
      <h3>Welcome {user.name} {user.surname}</h3>
      <p>Email: {user.email}</p>
    </div>
  );
}

export default Dashboard;
