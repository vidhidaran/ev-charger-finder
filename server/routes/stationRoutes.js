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

module.exports = router;