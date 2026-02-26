import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    slotDate: {
      type: Date,
      required: true,
    },
    slotTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "completed", "cancelled"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

bookingSchema.index({ doctor: 1, slotDate: 1, slotTime: 1 });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
