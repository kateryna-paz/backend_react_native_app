const express = require("express");
const router = express.Router();
const { Region } = require("../models/region");

router.get(`/`, async (req, res) => {
  try {
    const regionList = await Region.find();

    if (!regionList || regionList.length === 0) {
      return res
        .status(404)
        .json({ message: "Panel Types not found", success: false });
    }
    res.send(regionList);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

router.get(`/names`, async (req, res) => {
  try {
    const regionList = await Region.find().select("name");

    if (!regionList || regionList.length === 0) {
      return res
        .status(404)
        .json({ message: "Panel Types not found", success: false });
    }
    res.send(regionList);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

router.get(`/:id`, async (req, res) => {
  try {
    const region = await Region.findById(req.params.id);

    if (!region) {
      return res
        .status(404)
        .json({ message: "Panel Types not found", success: false });
    }
    res.send(region);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

module.exports = router;
