const express = require("express");
const router = express.Router();
const { User } = require("../models/user");

router.get(`/`, async (req, res) => {
  try {
    const userList = await User.find();

    if (!userList || userList.length === 0) {
      return res
        .status(404)
        .json({ message: "Users not found", success: false });
    }
    res.send(userList);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

router.post(`/`, async (req, res) => {
  const user = new User({
    email: req.body.email,
    passwordHash: req.body.passwordHash,
    name: req.body.name,
    location: req.body.location,
    solarPanelIds: req.body.solarPanelInfo,
    applianceIds: req.body.appliances,
  });

  try {
    const createdUser = await user.save();
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

router.put(`/:id`, async (req, res) => {
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        email: req.body.email,
        passwordHash: req.body.passwordHash,
        name: req.body.name,
        location: req.body.location,
        solarPanelIds: req.body.solarPanelInfo,
        applianceIds: req.body.appliances,
      },
      { new: true }
    );

    if (!updateUser) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    res.send(updateUser);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

module.exports = router;
