const Station = require("../models/Station");

exports.addStation = async (req, res) => {
  try {
    const { name, address, latitude, longitude, connectorTypes, powerKW, availability, pricePerKWh, hours } = req.body;

    const newStation = new Station({
      name,
      address,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      connectorTypes,
      powerKW,
      availability,
      pricePerKWh,
      hours
    });

    await newStation.save();

    res.status(201).json({
      message: "Station added successfully",
      station: newStation,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
