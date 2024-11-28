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
        .json({ success: false, message: "Panels not found" });
    }

    res.status(200).json(panelList);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get(`/:id`, async (req, res) => {
  try {
    const panel = await Panel.findById(req.params.id).populate("typeId");

    if (!panel) {
      return res
        .status(404)
        .json({ success: false, message: "Panel not found" });
    }

    res.status(200).json(panel);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post(`/`, async (req, res) => {
  try {
    const { square, number, typeId, userId } = req.body;

    const type = await PanelType.findById(typeId);
    if (!type) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid panel type" });
    }

    const panel = new Panel({ square, number, typeId, userId });
    const createdPanel = await panel.save();

    const populatedPanel = await Panel.findById(createdPanel._id).populate(
      "typeId"
    );

    res.status(201).json(populatedPanel);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const panels = await Panel.find({ userId }).populate("typeId");

    if (!panels || panels.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No panels found for this user" });
    }

    res.status(200).json(panels);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

router.put(`/:id`, async (req, res) => {
  try {
    const { square, number, typeId } = req.body;

    const updatedPanel = await Panel.findByIdAndUpdate(
      req.params.id,
      { square, number, typeId },
      { new: true }
    ).populate("typeId");

    if (!updatedPanel) {
      return res
        .status(404)
        .json({ success: false, message: "Panel not found" });
    }

    res.status(200).json(updatedPanel);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete(`/:id`, async (req, res) => {
  try {
    const panel = await Panel.findByIdAndDelete(req.params.id);

    if (!panel) {
      return res
        .status(404)
        .json({ success: false, message: "Panel not found" });
    }

    res.status(200).json({ success: true, message: "The panel was deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
