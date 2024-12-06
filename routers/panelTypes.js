const express = require("express");
const router = express.Router();
const { PanelType } = require("../models/panelType");

router.get(`/`, async (req, res) => {
  try {
    const panelTypeList = await PanelType.find();

    if (!panelTypeList || panelTypeList.length === 0) {
      return res
        .status(404)
        .json({ message: "Panel Types not found", success: false });
    }
    res.send(panelTypeList);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

router.get(`/:id`, async (req, res) => {
  try {
    const panelType = await PanelType.findById(req.params.id);

    if (!panelType) {
      return res
        .status(404)
        .json({ message: "Panel Types not found", success: false });
    }
    res.send(panelType);
  } catch (error) {
    res.status(500).json({ error: error.message, success: false });
  }
});

module.exports = router;
