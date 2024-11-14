const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const { Location } = require("../models/location");
const { Panel } = require("../models/panel");
const { Appliance } = require("../models/appliance");
const bcrypt = require("bcryptjs");

router.get(`/`, async (req, res) => {
  try {
    const userList = await User.find().populate(
      "locationId panelIds applianceIds"
    );

    if (!userList || userList.length === 0) {
      return res
        .status(404)
        .json({ message: "Users not found", success: false });
    }
    res.status(200).send(userList);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

router.get(`/:id`, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "locationId panelIds applianceIds"
    );

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

router.post(`/`, async (req, res) => {
  const { name, email, password, locationId, panelIds, applianceIds } =
    req.body;

  try {
    const location = await Location.findById(locationId);
    if (!location) return res.status(404).json({ message: "Invalid location" });

    const appliances = await Appliance.find({ _id: { $in: applianceIds } });
    if (appliances.length !== applianceIds.length) {
      return res
        .status(404)
        .json({ message: "One or more invalid appliances" });
    }

    const panels = await Panel.find({ _id: { $in: panelIds } });
    if (panels.length !== panelIds.length) {
      return res.status(404).json({ message: "One or more invalid panels" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      email: email,
      passwordHash: hashedPassword,
      name: name,
      locationId: locationId,
      panelIds: panelIds,
      applianceIds: applianceIds,
    });

    const createdUser = await user.save();
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

router.put(`/:id`, async (req, res) => {
  const { name, email, password, locationId, panelIds, applianceIds } =
    req.body;

  try {
    const updateFields = {
      email: email,
      name: name,
      locationId: locationId,
      panelIds: panelIds,
      applianceIds: applianceIds,
    };

    if (password) {
      const saltRounds = 10;
      updateFields.passwordHash = await bcrypt.hash(password, saltRounds);
    }

    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!updateUser) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    res.status(200).send(updateUser);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

module.exports = router;
