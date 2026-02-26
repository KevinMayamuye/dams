import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import {
  getDoctors,
  createDoctor,
  getBookings,
  updateBooking,
  createBooking,
  getAvailableSlots,
} from "../services/api";

export default function Dashboard() {
  const { user, setUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [doctorForm, setDoctorForm] = useState({ name: "", surname: "", email: "" });
  const [bookingForm, setBookingForm] = useState({
    name: "",
    surname: "",
    email: "",
    reason: "",
    doctorId: "",
    slotDate: "",
    slotTime: "",
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!loading && !user) navigate("/");
    if (user && user.role !== "admin") navigate("/");
  }, [user, loading, navigate]);

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    loadBookings();
  }, [filter]);

  useEffect(() => {
    if (!bookingForm.doctorId || !bookingForm.slotDate) {
      setAvailableSlots([]);
      return;
    }
    setLoadingSlots(true);
    getAvailableSlots(bookingForm.doctorId, bookingForm.slotDate)
      .then((res) => setAvailableSlots(res.data))
      .catch(() => setAvailableSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [bookingForm.doctorId, bookingForm.slotDate]);

  const loadDoctors = () => {
    getDoctors()
      .then((res) => setDoctors(res.data))
      .catch(() => setDoctors([]));
  };

  const loadBookings = () => {
    const statusParam = filter === "all" ? undefined : filter;
    getBookings(statusParam)
      .then((res) => setBookings(res.data))
      .catch(() => setBookings([]));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const handleDoctorSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    createDoctor(doctorForm)
      .then(() => {
        setDoctorForm({ name: "", surname: "", email: "" });
        setShowDoctorForm(false);
        loadDoctors();
        setMessage("Doctor registered.");
      })
      .catch((err) => setMessage(err.response?.data?.message || "Failed"));
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    createBooking(bookingForm)
      .then(() => {
        setBookingForm({
          name: "",
          surname: "",
          email: "",
          reason: "",
          doctorId: "",
          slotDate: "",
          slotTime: "",
        });
        setShowBookingForm(false);
        loadBookings();
        setMessage("Booking created.");
      })
      .catch((err) => setMessage(err.response?.data?.message || "Failed"));
  };

  const handleStatusChange = (id, status) => {
    updateBooking(id, status)
      .then(() => loadBookings())
      .catch((err) => setMessage(err.response?.data?.message || "Update failed"));
  };

  if (loading || !user) return <p>Loading...</p>;

  return (
    <div style={{ padding: 40 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2>Tinybel Admin</h2>
        <button type="button" onClick={handleLogout}>Logout</button>
      </div>
      {message && <p style={{ color: "green" }}>{message}</p>}

      <section style={{ marginBottom: 32 }}>
        <h3>Register doctor</h3>
        {!showDoctorForm ? (
          <button type="button" onClick={() => setShowDoctorForm(true)}>Add doctor</button>
        ) : (
          <form onSubmit={handleDoctorSubmit} style={{ maxWidth: 300 }}>
            <div style={{ marginBottom: 8 }}>
              <input
              value={doctorForm.name}
              onChange={(e) => setDoctorForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Name"
              required
            />
            </div>
            <div style={{ marginBottom: 8 }}>
              <input
              value={doctorForm.surname}
              onChange={(e) => setDoctorForm((f) => ({ ...f, surname: e.target.value }))}
              placeholder="Surname"
              required
            />
            </div>
            <div style={{ marginBottom: 8 }}>
              <input
              type="email"
              value={doctorForm.email}
              onChange={(e) => setDoctorForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="Email (optional)"
            />
            </div>
            <button type="submit">Register</button>
            <button type="button" onClick={() => setShowDoctorForm(false)}>Cancel</button>
          </form>
        )}
      </section>

      <section style={{ marginBottom: 32 }}>
        <h3>Book for another person</h3>
        {!showBookingForm ? (
          <button type="button" onClick={() => setShowBookingForm(true)}>New booking</button>
        ) : (
          <form onSubmit={handleBookingSubmit} style={{ maxWidth: 400 }}>
            <div style={{ marginBottom: 8 }}>
              <input
              value={bookingForm.name}
              onChange={(e) => setBookingForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Name"
              required
            />
            </div>
            <div style={{ marginBottom: 8 }}>
              <input
              value={bookingForm.surname}
              onChange={(e) => setBookingForm((f) => ({ ...f, surname: e.target.value }))}
              placeholder="Surname"
              required
            />
            </div>
            <div style={{ marginBottom: 8 }}>
              <input
              type="email"
              value={bookingForm.email}
              onChange={(e) => setBookingForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="Email"
              required
            />
            </div>
            <div style={{ marginBottom: 8 }}>
              <input
              value={bookingForm.reason}
              onChange={(e) => setBookingForm((f) => ({ ...f, reason: e.target.value }))}
              placeholder="Reason for booking"
              required
            />
            </div>
            <div style={{ marginBottom: 8 }}>
            <select
              value={bookingForm.doctorId}
              onChange={(e) => setBookingForm((f) => ({ ...f, doctorId: e.target.value, slotTime: "" }))}
              required
            >
              <option value="">Select doctor</option>
              {doctors.map((d) => (
                <option key={d._id} value={d._id}>{d.name} {d.surname}</option>
              ))}
            </select>
            </div>
            <div style={{ marginBottom: 8 }}>
            <input
              type="date"
              value={bookingForm.slotDate}
              onChange={(e) => setBookingForm((f) => ({ ...f, slotDate: e.target.value, slotTime: "" }))}
              required
            />
            </div>
            <div style={{ marginBottom: 8 }}>
            <select
              value={bookingForm.slotTime}
              onChange={(e) => setBookingForm((f) => ({ ...f, slotTime: e.target.value }))}
              required
              disabled={loadingSlots || !bookingForm.doctorId || !bookingForm.slotDate}
            >
              <option value="">Select slot</option>
              {availableSlots.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            </div>
            <button type="submit">Create booking</button>
            <button type="button" onClick={() => setShowBookingForm(false)}>Cancel</button>
          </form>
        )}
      </section>

      <section>
        <h3>All bookings</h3>
        <div style={{ marginBottom: 8 }}>
          <button type="button" onClick={() => setFilter("all")}>All</button>
          <button type="button" onClick={() => setFilter("pending")}>Pending</button>
          <button type="button" onClick={() => setFilter("approved")}>Approved</button>
          <button type="button" onClick={() => setFilter("completed")}>Completed</button>
          <button type="button" onClick={() => setFilter("cancelled")}>Cancelled</button>
        </div>
        {bookings.length === 0 ? (
          <p>No bookings.</p>
        ) : (
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ccc", padding: 8 }}>Patient</th>
                <th style={{ border: "1px solid #ccc", padding: 8 }}>Email</th>
                <th style={{ border: "1px solid #ccc", padding: 8 }}>Doctor</th>
                <th style={{ border: "1px solid #ccc", padding: 8 }}>Date / Time</th>
                <th style={{ border: "1px solid #ccc", padding: 8 }}>Reason</th>
                <th style={{ border: "1px solid #ccc", padding: 8 }}>Status</th>
                <th style={{ border: "1px solid #ccc", padding: 8 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td style={{ border: "1px solid #ccc", padding: 8 }}>{b.name} {b.surname}</td>
                  <td style={{ border: "1px solid #ccc", padding: 8 }}>{b.email}</td>
                  <td style={{ border: "1px solid #ccc", padding: 8 }}>
                    {b.doctor?.name} {b.doctor?.surname}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: 8 }}>
                    {b.slotDate ? new Date(b.slotDate).toLocaleDateString() : ""} {b.slotTime}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: 8 }}>{b.reason}</td>
                  <td style={{ border: "1px solid #ccc", padding: 8 }}>{b.status}</td>
                  <td style={{ border: "1px solid #ccc", padding: 8 }}>
                    {b.status === "pending" && (
                      <>
                        <button type="button" onClick={() => handleStatusChange(b._id, "approved")}>Approve</button>
                        <button type="button" onClick={() => handleStatusChange(b._id, "cancelled")}>Cancel</button>
                      </>
                    )}
                    {b.status === "approved" && (
                      <button type="button" onClick={() => handleStatusChange(b._id, "completed")}>Mark completed</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
