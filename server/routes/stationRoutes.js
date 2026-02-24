const express = require("express");
const router = express.Router();
const Station = require("../models/Station");

// 1. Add a station (POST)
router.post("/add", async (req, res) => {
  try {
    const station = new Station(req.body);
    await station.save();
    res.status(201).json({ message: "Station added successfully", station });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Get all stations (GET)
router.get("/", async (req, res) => {
  try {
    const stations = await Station.find();
    res.json(stations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Update a station by ID (PUT)
router.put("/:id", async (req, res) => {
  try {
    const updatedStation = await Station.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated document
    );
    res.json(updatedStation);
  } catch (error) {
    res.status(500).json({ message: "Error updating station" });
  }
});

// 4. Delete a station by ID (DELETE)
router.delete("/:id", async (req, res) => {
  try {
    await Station.findByIdAndDelete(req.params.id);
    res.json({ message: "Station deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting station" });
  }
});

// 5. Get a single station by ID
router.get("/:id", async (req, res) => {
  try {
    const station = await Station.findById(req.params.id);
    if (!station) return res.status(404).json({ message: "Station not found" });
    res.json(station);
  } catch (error) {
    res.status(500).json({ message: "Error fetching station" });
  }
});

// 6. Book a slot with Date and Time
router.post("/:id/book", async (req, res) => {
  try {
    const { date, time, customerName, customerPhone } = req.body;
    if (!date || !time || !customerName || !customerPhone) {
      return res.status(400).json({ message: "Date, Time, Name, and Phone are required" });
    }

    const station = await Station.findById(req.params.id);
    if (!station) return res.status(404).json({ message: "Station not found" });

    let slotRecord = station.bookedTimeSlots.find(s => s.date === date && s.time === time);
    const bookingDetails = { customerName, customerPhone, bookedAt: new Date() };

    if (slotRecord) {
      if (slotRecord.count >= station.totalSlots) {
        return res.status(400).json({ message: "This slot is already fully booked" });
      }
      slotRecord.count += 1;
      if (!slotRecord.bookings) slotRecord.bookings = [];
      slotRecord.bookings.push(bookingDetails);
    } else {
      // If the slot record doesn't exist, max is the total capacity.
      if (station.totalSlots <= 0) {
        return res.status(400).json({ message: "This station has no slots" });
      }
      station.bookedTimeSlots.push({
        date,
        time,
        count: 1,
        bookings: [bookingDetails]
      });
    }

    await station.save();
    res.json({ message: "Slot booked successfully!", station });
  } catch (error) {
    res.status(500).json({ message: "Error booking slot" });
  }
});

module.exports = router;