import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Profile = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <h3>Loading...</h3>;

  if (!user) return <Navigate to="/" />;

  return (
    <div>
      <h1>Welcome {user.name}</h1>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default Profile;
