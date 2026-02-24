const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema({
  name: String,
  address: String,
  latitude: Number,
  longitude: Number,
  connectorTypes: [String],
  powerKW: Number,
  availability: Boolean,
  pricePerKWh: Number,
  upiId: { type: String, default: "" },
  totalSlots: { type: Number, default: 10 },
  availableSlots: { type: Number, default: 10 },
  bookedTimeSlots: [
    {
      date: String,
      time: String,
      count: { type: Number, default: 0 },
      bookings: [
        {
          customerName: String,
          customerPhone: String,
          amountPaid: { type: Number, default: 50 },
          bookedAt: { type: Date, default: Date.now }
        }
      ]
    }
  ],
  hours: {
    open: String,
    close: String
  }
});

module.exports = mongoose.model("Station", stationSchema);
