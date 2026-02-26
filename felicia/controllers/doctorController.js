import Doctor from "../models/Doctor.js";

export const listDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isActive: true }).sort({ surname: 1, name: 1 });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createDoctor = async (req, res) => {
  try {
    const { name, surname, email } = req.body;
    if (!name || !surname) {
      return res.status(400).json({ message: "Name and surname are required" });
    }
    const doctor = await Doctor.create({ name, surname, email: email || "" });
    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
