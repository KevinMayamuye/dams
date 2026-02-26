import Booking from "../models/Booking.js";
import mongoose from "mongoose";

// 9:00 to 17:00 in 30-min steps
const ALL_SLOT_TIMES = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00",
];

export const getAvailableSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;
    if (!doctorId || !date) {
      return res.status(400).json({ message: "doctorId and date are required" });
    }
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const taken = await Booking.find({
      doctor: new mongoose.Types.ObjectId(doctorId),
      slotDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $nin: ["cancelled"] },
    }).select("slotTime");

    const takenSet = new Set(taken.map((b) => b.slotTime));
    const available = ALL_SLOT_TIMES.filter((t) => !takenSet.has(t));
    res.json(available);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { name, surname, email, reason, doctorId, slotDate, slotTime } = req.body;
    if (!name || !surname || !email || !reason || !doctorId || !slotDate || !slotTime) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const slotDateObj = new Date(slotDate);
    slotDateObj.setUTCHours(0, 0, 0, 0);

    const booking = await Booking.create({
      name,
      surname,
      email,
      reason,
      doctor: doctorId,
      slotDate: slotDateObj,
      slotTime,
      createdBy: req.user ? req.user._id : undefined,
    });
    const populated = await Booking.findById(booking._id).populate("doctor", "name surname");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const listBookings = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (req.user.role === "admin") {
      if (status) query.status = status;
    } else {
      query.email = req.user.email;
      if (status) query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate("doctor", "name surname email")
      .sort({ slotDate: -1, slotTime: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status || !["pending", "approved", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Valid status is required" });
    }
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate("doctor", "name surname email");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
