const express = require("express");
const router = express.Router();
const { Panel } = require("../models/panel");
const { PanelType } = require("../models/panelType");
const { AppError, ERROR_TYPES } = require("../helpers/error-handler");

router.get("/", async (req, res, next) => {
  try {
    const panelList = await Panel.find().populate("typeId");

    if (!panelList.length) {
      throw new AppError(ERROR_TYPES.NOT_FOUND, "Панелі не знайдено");
    }

    res.status(200).json(panelList);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const panel = await Panel.findById(req.params.id).populate("typeId");

    if (!panel) {
      throw new AppError(ERROR_TYPES.NOT_FOUND, "Панель не знайдено");
    }

    res.status(200).json(panel);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { power, number, typeId, userId } = req.body;

    const type = await PanelType.findById(typeId);
    if (!type) {
      throw new AppError(ERROR_TYPES.NOT_FOUND, "Невірний тип панелі");
    }

    const panel = new Panel({ power, number, typeId, userId });
    const createdPanel = await panel.save();

    const populatedPanel = await Panel.findById(createdPanel._id).populate(
      "typeId"
    );

    res.status(201).json(populatedPanel);
  } catch (error) {
    next(error);
  }
});

router.get("/userId/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;

    const panels = await Panel.find({ userId }).populate("typeId");

    if (!panels.length) {
      return res
        .status(200)
        .json({ message: "Для цього користувача немає панелей" });
    }

    res.status(200).json(panels);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { power, number, typeId } = req.body;

    const updatedPanel = await Panel.findByIdAndUpdate(
      req.params.id,
      { power, number, typeId },
      { new: true }
    ).populate("typeId");

    if (!updatedPanel) {
      throw new AppError(ERROR_TYPES.NOT_FOUND, "Панель не знайдено");
    }

    res.status(200).json(updatedPanel);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const panel = await Panel.findByIdAndDelete(req.params.id);

    if (!panel) {
      throw new AppError(ERROR_TYPES.NOT_FOUND, "Панель не знайдено");
    }

    res.status(200).json({ success: true, message: "Панель видалено" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
