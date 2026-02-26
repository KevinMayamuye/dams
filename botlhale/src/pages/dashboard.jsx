import { useEffect, useContext, useState } from "react";
import { getProfile } from "../services/authService";
import {
  getDoctors,
  getAvailableSlots,
  createBooking,
  getMyBookings,
} from "../services/bookingService";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user, setUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    name: "",
    surname: "",
    reason: "",
    doctorId: "",
    slotDate: "",
    slotTime: "",
    email: "",
  });

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

  useEffect(() => {
    if (!user) return;
    setForm((f) => ({ ...f, name: user.name, surname: user.surname, email: user.email }));
  }, [user]);

  const loadDoctors = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await getDoctors(token);
      setDoctors(res.data);
    } catch (_) {
      setDoctors([]);
    }
  };

  useEffect(() => {
    if (showBookingForm && doctors.length === 0) loadDoctors();
  }, [showBookingForm]);

  const loadAvailableSlots = async () => {
    if (!form.doctorId || !form.slotDate) {
      setAvailableSlots([]);
      return;
    }
    setLoadingSlots(true);
    try {
      const res = await getAvailableSlots(form.doctorId, form.slotDate);
      setAvailableSlots(res.data);
    } catch (_) {
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    loadAvailableSlots();
  }, [form.doctorId, form.slotDate]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (name === "doctorId" || name === "slotDate") setForm((f) => ({ ...f, slotTime: "" }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await createBooking(
        {
          name: form.name,
          surname: form.surname,
          email: form.email,
          reason: form.reason,
          doctorId: form.doctorId,
          slotDate: form.slotDate,
          slotTime: form.slotTime,
        },
        token
      );
      setForm((f) => ({ ...f, reason: "", doctorId: "", slotDate: "", slotTime: "" }));
      setShowBookingForm(false);
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Booking failed");
    }
  };

  const openStatus = async () => {
    setShowStatus(true);
    setShowBookingForm(false);
    setLoadingBookings(true);
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await getMyBookings(token);
      setMyBookings(res.data);
    } catch (_) {
      setMyBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

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

      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <button type="button" onClick={() => { setShowBookingForm(true); setShowStatus(false); }}>
          Booking
        </button>
        <button type="button" onClick={openStatus}>
          Check booking status
        </button>
      </div>

      {showBookingForm && (
        <div style={{ marginTop: 24, maxWidth: 400 }}>
          <h3>New booking</h3>
          <form onSubmit={handleBookingSubmit}>
            <div style={{ marginBottom: 8 }}>
              <input
                name="name"
                value={form.name}
                onChange={handleFormChange}
                placeholder="Name"
                required
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <input
                name="surname"
                value={form.surname}
                onChange={handleFormChange}
                placeholder="Surname"
                required
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleFormChange}
                placeholder="Email"
                required
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <input
                name="reason"
                value={form.reason}
                onChange={handleFormChange}
                placeholder="Reason for booking"
                required
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <select
                name="doctorId"
                value={form.doctorId}
                onChange={handleFormChange}
                required
              >
                <option value="">Select doctor</option>
                {doctors.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} {d.surname}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginBottom: 8 }}>
              <input
                name="slotDate"
                type="date"
                value={form.slotDate}
                onChange={handleFormChange}
                required
              />
            </div>
            <div style={{ marginBottom: 8 }}>
              <select
                name="slotTime"
                value={form.slotTime}
                onChange={handleFormChange}
                required
                disabled={loadingSlots || !form.doctorId || !form.slotDate}
              >
                <option value="">Select slot</option>
                {availableSlots.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {loadingSlots && <span style={{ marginLeft: 8 }}>Loading slots...</span>}
            </div>
            {submitError && <p style={{ color: "red" }}>{submitError}</p>}
            <button type="submit">Submit booking</button>
            <button type="button" onClick={() => setShowBookingForm(false)} style={{ marginLeft: 8 }}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {showStatus && (
        <div style={{ marginTop: 24 }}>
          <h3>Your bookings</h3>
          {loadingBookings ? (
            <p>Loading...</p>
          ) : myBookings.length === 0 ? (
            <p>No bookings yet.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {myBookings.map((b) => (
                <li key={b._id} style={{ marginBottom: 12, padding: 8, border: "1px solid #ccc" }}>
                  <strong>{b.doctor?.name} {b.doctor?.surname}</strong> — {b.slotDate ? new Date(b.slotDate).toLocaleDateString() : ""} {b.slotTime} — {b.reason} — <em>Status: {b.status}</em>
                </li>
              ))}
            </ul>
          )}
          <button type="button" onClick={() => setShowStatus(false)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
