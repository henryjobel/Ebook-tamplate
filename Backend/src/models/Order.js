import mongoose from "mongoose";

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: "" },
    method: { type: String, enum: ["bkash", "nagad"], required: true },
    transactionId: { type: String, required: true },
    amount: { type: Number, default: 0 },
    orderBump: { type: Boolean, default: false },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    deliveryStatus: { type: String, default: "not_required" },
    trackingNumber: { type: String, default: "" },
    deliveryNote: { type: String, default: "" },
    downloadToken: { type: String, default: "" }
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
