const express = require("express");
const router = express.Router();
const { Panel } = require("../models/panel");
const { PanelType } = require("../models/panelType");

router.get(`/`, async (req, res) => {
  try {
    const panelList = await Panel.find().populate("typeId");

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
    const panel = await Panel.findById(req.params.id).populate("typeId");

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
  const type = await PanelType.findById(req.body.typeId);
  if (!type) return res.status(404).json({ message: "Invalid type" });
  const panel = new Panel({
    square: req.body.square,
    number: req.body.number,
    typeId: req.body.typeId,
  });

  try {
    const createdPanel = await panel.save();
    res.status(201).json(createdPanel._id);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

router.post(`/batch`, async (req, res) => {
  try {
    const { panelIds } = req.body;

    if (!Array.isArray(panelIds) || panelIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid array of panel IDs.",
      });
    }

    const panels = await Panel.find({ _id: { $in: panelIds } }).populate(
      "typeId"
    );

    if (panels.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No panels found for the provided IDs.",
      });
    }

    res.status(200).json(panels);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.put(`/:id`, async (req, res) => {
  try {
    const updatePanel = await Panel.findByIdAndUpdate(
      req.params.id,
      {
        square: req.body.square,
        number: req.body.number,
        typeId: req.body.typeId,
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

router.delete(`/:id`, async (req, res) => {
  Panel.findByIdAndDelete(req.params.id)
    .then((panel) => {
      if (panel) {
        return res
          .status(200)
          .json({ success: true, message: "The panel was deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Panel not found" });
      }
    })
    .catch((error) => {
      return res.status(500).json({ success: false, error: error });
    });
});

module.exports = router;
