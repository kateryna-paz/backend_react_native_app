const express = require("express");
const router = express.Router();
const { Location } = require("../models/location");
const { Region } = require("../models/region");

router.get(`/`, async (req, res) => {
  try {
    const locationList = await Location.find();

    if (!locationList || locationList.length === 0) {
      return res
        .status(404)
        .json({ message: "Locations not found", success: false });
    }
    res.send(locationList);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

router.get(`/:id`, async (req, res) => {
  try {
    const location = await Location.find(req.params.id);

    if (!location) {
      return res
        .status(404)
        .json({ message: "Location not found", success: false });
    }
    res.send(location);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

router.get(`/:id/coordinates`, async (req, res) => {
  try {
    const coordinates = await Location.find(req.params.id).select(
      "coordinates"
    );

    if (!coordinates) {
      return res
        .status(404)
        .json({ message: "Location not found", success: false });
    }
    res.send(coordinates);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

router.get(`/:id/dailyEnergy`, async (req, res) => {
  try {
    const energy = await Location.find(req.params.id).select(
      "dailyEnergyProduced"
    );

    if (!energy) {
      return res
        .status(404)
        .json({ message: "Location not found", success: false });
    }
    res.send(energy);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

router.post(`/`, async (req, res) => {
  const region = Region.findById(req.params.region);

  if (!region) return res.status(404).json({ message: "Invalid region" });

  const location = new Location({
    region: req.body.region,
    coordinates: req.body.coordinates,
    dailyEnergyProduced: req.body.dailyEnergyProduced,
  });

  try {
    const createdLocation = await location.save();
    res.status(201).json(createdLocation);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

router.put(`/:id`, async (req, res) => {
  try {
    const updatedLocation = await Location.findByIdAndUpdate(
      req.params.id,
      {
        region: req.body.region,
        coordinates: req.body.coordinates,
        dailyEnergyProduced: req.body.dailyEnergyProduced,
      },
      { new: true }
    );

    if (!updatedLocation) {
      return res
        .status(404)
        .json({ message: "Location not found", success: false });
    }
    res.send(updatedLocation);
  } catch (error) {
    console.error("Update error:", error);
    res
      .status(500)
      .json({ message: "Server error", success: false, error: error.message });
  }
});

router.delete(`/:id`, async (req, res) => {
  Location.findByIdAndDelete(req.params.id)
    .then((location) => {
      if (!location) {
        return res
          .status(404)
          .json({ message: "Location not found", success: false });
      } else {
        return res
          .status(200)
          .json({ success: true, message: "The location was deleted" });
      }
    })
    .catch((error) => {
      return res.status(500).json({ success: false, error: error });
    });
});

module.exports = router;
