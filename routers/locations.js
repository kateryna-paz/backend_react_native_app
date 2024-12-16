const express = require("express");
const router = express.Router();
const { Location } = require("../models/location");
const { Region } = require("../models/region");
const { User } = require("../models/user");

router.get("/", async (req, res) => {
  try {
    const locationList = await Location.find().populate("regionId");

    if (!locationList.length) {
      return res
        .status(404)
        .json({ success: false, message: "Locations not found" });
    }

    res.status(200).json(locationList);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const location = await Location.findById(req.params.id).populate(
      "regionId"
    );

    if (!location) {
      return res
        .status(404)
        .json({ success: false, message: "Location not found" });
    }

    res.status(200).json(location);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/userId/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const location = await Location.findOne({ userId }).populate("regionId");

    if (!location) {
      return res
        .status(200)
        .json({ message: "No location found for this user" });
    }

    res.status(200).json(location);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { regionName, coordinates, dailyEnergyProduced, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Invalid user" });
    }

    const region = await Region.findOne({ name: regionName });
    if (!region) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid region" });
    }

    const locationUser = await Location.findOne({ userId });
    if (locationUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already has a location" });
    }

    const location = new Location({
      regionId: region._id,
      coordinates,
      dailyEnergyProduced,
      userId,
    });
    const createdLocation = await location.save();

    const populatedLocation = await Location.findById(
      createdLocation._id
    ).populate("regionId");

    res.status(201).json(populatedLocation);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { regionName, coordinates, dailyEnergyProduced, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "Invalid user" });
    }

    const region = await Region.findOne({ name: regionName });
    if (!region) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid region" });
    }

    const updatedLocation = await Location.findByIdAndUpdate(
      req.params.id,
      { regionId: region._id, coordinates, dailyEnergyProduced },
      { new: true }
    ).populate("regionId");

    if (!updatedLocation) {
      return res
        .status(404)
        .json({ success: false, message: "Location not found" });
    }

    res.status(200).json(updatedLocation);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedLocation = await Location.findByIdAndDelete(req.params.id);

    if (!deletedLocation) {
      return res
        .status(404)
        .json({ success: false, message: "Location not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "The location was deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
