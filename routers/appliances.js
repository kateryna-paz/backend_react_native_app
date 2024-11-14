const express = require("express");
const router = express.Router();
const { Appliance } = require("../models/appliance");

router.get(`/`, async (req, res) => {
  const applianceList = await Appliance.find();

  if (!applianceList || applianceList.length === 0) {
    return res
      .status(404)
      .json({ message: "Appliances not found", success: false });
  }
  res.status(200).send(applianceList);
});

router.get(`/names`, async (req, res) => {
  const applianceList = await Appliance.find().select("name id");

  if (!applianceList || applianceList.length === 0) {
    return res
      .status(404)
      .json({ message: "Appliances not found", success: false });
  }
  res.status(200).send(applianceList);
});

router.get(`/:id`, async (req, res) => {
  const appliance = await Appliance.findById(req.params.id);

  if (!appliance) {
    return res
      .status(404)
      .json({ message: "Appliance not found", success: false });
  }
  res.status(200).send(appliance);
});

router.put("/:id", async (req, res) => {
  try {
    const appliance = await Appliance.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, power: req.body.power },
      { new: true }
    );

    if (!appliance) {
      return res
        .status(404)
        .json({ message: "Appliance not found", success: false });
    }

    res.send(appliance);
  } catch (error) {
    console.error("Update error:", error);
    res
      .status(500)
      .json({ message: "Server error", success: false, error: error.message });
  }
});

router.post(`/`, (req, res) => {
  const appliance = new Appliance({
    name: req.body.name,
    power: req.body.power,
  });
  appliance
    .save()
    .then((createdAppliance) => {
      res.status(201).json(createdAppliance);
    })
    .catch((error) => {
      res.status(500).json({ error: error, success: false });
    });
});

router.delete(`/:id`, (req, res) => {
  Appliance.findByIdAndDelete(req.params.id)
    .then((appliance) => {
      if (appliance) {
        return res
          .status(200)
          .json({ success: true, message: "The appliance was deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Appliance not found" });
      }
    })
    .catch((error) => {
      return res.status(500).json({ success: false, error: error });
    });
});

module.exports = router;
