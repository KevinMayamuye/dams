import { useEffect, useState } from "react";
import { getProfile } from "../services/authService";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      try {
        const res = await getProfile(token);
        setUser(res.data);
      } catch (err) {
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    loadProfile();
  }, []);

  if (!user) return <h3>Loading...</h3>;

  return (
    <div style={{ padding: "40px" }}>
      <h2>Dashboard</h2>
      <h3>Welcome {user.name} {user.surname}</h3>
      <p>Email: {user.email}</p>
    </div>
  );
}

export default Dashboard;
