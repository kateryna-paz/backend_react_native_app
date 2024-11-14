const express = require("express");
const router = express.Router();
const { Panel } = require("../models/panel");
const { PanelType } = require("../models/panelType");

router.get(`/`, async (req, res) => {
  try {
    const panelList = await Panel.find().populate("type");

    if (!panelList || panelList.length === 0) {
      return res
        .status(404)
        .json({ message: "Panels not found", success: false });
    }
    res.status(200).send(panelList);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

router.get(`/:id`, async (req, res) => {
  try {
    const panel = await Panel.findById(req.params.id).populate("type");

    if (!panel) {
      return res
        .status(404)
        .json({ message: "Panel not found", success: false });
    }
    res.status(200).send(panel);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

router.post(`/`, async (req, res) => {
  const type = await PanelType.findById(req.body.type);
  if (!type) return res.status(404).json({ message: "Invalid type" });
  const panel = new Panel({
    square: req.body.square,
    number: req.body.number,
    type: req.body.type,
  });

  try {
    const createdPanel = await panel.save();
    res.status(201).json(createdPanel);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

router.put(`/:id`, async (req, res) => {
  try {
    const updatePanel = await Panel.findByIdAndUpdate(
      req.body.id,
      {
        square: req.body.square,
        number: req.body.number,
        type: req.body.type,
      },
      { new: true }
    );
    if (!updatePanel) {
      return res
        .status(404)
        .json({ message: "Panel not found", success: false });
    }
    res.send(updatePanel);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

module.exports = router;
