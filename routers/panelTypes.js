const express = require("express");
const router = express.Router();
const { PanelType } = require("../models/panelType");
const { AppError, ERROR_TYPES } = require("../helpers/error-handler");

router.get("/", async (req, res, next) => {
  try {
    const panelTypeList = await PanelType.find();

    if (!panelTypeList.length) {
      throw new AppError(ERROR_TYPES.NOT_FOUND, "Типи панелей не знайдено");
    }

    res.status(200).json(panelTypeList);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const panelType = await PanelType.findById(req.params.id);

    if (!panelType) {
      throw new AppError(ERROR_TYPES.NOT_FOUND, "Тип панелі не знайдено");
    }

    res.status(200).json(panelType);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
