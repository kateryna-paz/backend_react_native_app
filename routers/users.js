const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const { Location } = require("../models/location");
const { Panel } = require("../models/panel");
const { Appliance } = require("../models/appliance");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secretOrPrivateKey = process.env.JWT_SECRET;
if (!secretOrPrivateKey) {
  throw new Error("JWT secret is missing or invalid");
}

router.get(`/`, async (req, res) => {
  try {
    const userList = await User.find()
      .select("-passwordHash")
      .populate("locationId panelIds applianceIds")
      .populate({ path: "locationId", populate: "regionId" });

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
    const user = await User.findById(req.params.id)
      .select("-passwordHash")
      .populate("locationId panelIds applianceIds")
      .populate({ path: "locationId", populate: "regionId" });

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

router.post(`/register`, async (req, res) => {
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

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return res.status(404).send("The user not found");
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign({ usedId: user.id }, secretOrPrivateKey, {
      expiresIn: "1d",
    });
    return res.status(200).send(`User authenticated with the token: ${token}.`);
  } else {
    return res.status(400).send("Incorrect password");
  }
});

router.delete(`:id`, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const { applianceIds, locationId, panelIds } = user;

    await User.findByIdAndDelete(req.params.id);

    if (applianceIds && applianceIds.length > 0) {
      await Appliance.deleteMany({ _id: { $in: applianceIds } });
    }

    if (locationId) {
      await Location.findByIdAndDelete(locationId);
    }

    if (panelIds && panelIds.length > 0) {
      panelIds.map(async (id) => {
        await Panel.findByIdAndDelete(id);
      });
    }

    return res.status(200).json({
      message: "The user and associated references were deleted",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

module.exports = router;
