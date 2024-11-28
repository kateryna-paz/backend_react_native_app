const express = require("express");
const router = express.Router();
const { Appliance } = require("../models/appliance");
const User = require("../models/user");

const importanceValues = ["низька", "середня", "висока"];

router.get("/", async (req, res) => {
  try {
    const appliances = await Appliance.find();
    if (!appliances.length) {
      return res
        .status(404)
        .json({ success: false, message: "No appliances found" });
    }
    res.status(200).json(appliances);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const appliance = await Appliance.findById(req.params.id);
    if (!appliance) {
      return res
        .status(404)
        .json({ success: false, message: "Appliance not found" });
    }
    res.status(200).json(appliance);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

router.get("/userId/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const appliances = await Appliance.find({ userId });

    if (!appliances || appliances.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No appliances found for this user" });
    }

    res.status(200).json(appliances);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, power, importance, userId } = req.body;
    if (!importanceValues.includes(importance)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid importance value" });
    }

    const newAppliance = new Appliance({
      name,
      power,
      importance,
      userId,
    });

    const savedAppliance = await newAppliance.save();
    res.status(201).json(savedAppliance);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, power, importance } = req.body;
    if (!importanceValues.includes(importance)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid importance value" });
    }

    const updatedAppliance = await Appliance.findByIdAndUpdate(
      req.params.id,
      { name, power, importance },
      { new: true, runValidators: true }
    );

    if (!updatedAppliance) {
      return res
        .status(404)
        .json({ success: false, message: "Appliance not found" });
    }

    res.status(200).json(updatedAppliance);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

router.delete(`/:id`, async (req, res) => {
  const applianceId = req.params.id;
  try {
    const appliance = await Appliance.findByIdAndDelete(applianceId);

    if (!appliance) {
      return res
        .status(404)
        .json({ success: false, message: "Appliance not found" });
    }

    return res.status(200).json({
      success: true,
      message: "The appliance was removed",
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
