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
  hours: {
    open: String,
    close: String
  }
});

module.exports = mongoose.model("Station", stationSchema);
