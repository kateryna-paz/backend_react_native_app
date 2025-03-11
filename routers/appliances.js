const express = require("express");
const router = express.Router();
const { Appliance } = require("../models/appliance");
const { AppError, ERROR_TYPES } = require("../helpers/error-handler");
const { User } = require("../models/user");

const importanceValues = ["низька", "середня", "висока"];

router.get("/", async (req, res, next) => {
  try {
    const appliances = await Appliance.find();
    if (!appliances.length) {
      throw new AppError(ERROR_TYPES.NOT_FOUND, "Прилади не знайдено");
    }
    res.status(200).json(appliances);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const appliance = await Appliance.findById(req.params.id);
    if (!appliance) {
      throw new AppError(ERROR_TYPES.NOT_FOUND, "Прилад не знайдено");
    }
    res.status(200).json(appliance);
  } catch (error) {
    next(error);
  }
});

router.get("/userId/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(
        ERROR_TYPES.NOT_FOUND,
        "Користувача з таким id не знайдено"
      );
    }

    const appliances = await Appliance.find({ userId });

    res.status(200).json(appliances);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, power, importance, userId } = req.body;
    if (!name || !power || !importance || !userId) {
      throw new AppError(
        ERROR_TYPES.VALIDATION_ERROR,
        "Відсутні обов'язкові поля"
      );
    }

    if (!importanceValues.includes(importance)) {
      throw new AppError(
        ERROR_TYPES.VALIDATION_ERROR,
        "Невірне значення пріоритету приладу"
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(
        ERROR_TYPES.NOT_FOUND,
        "Користувача з таким id не знайдено"
      );
    }

    const newAppliance = new Appliance({
      name,
      power,
      importance,
      userId,
    });

    const savedAppliance = await newAppliance.save();
    res.status(201).json(savedAppliance);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { name, power, importance } = req.body;
    if (importance && !importanceValues.includes(importance)) {
      throw new AppError(
        ERROR_TYPES.VALIDATION_ERROR,
        "Невірне значення пріоритету приладу"
      );
    }

    const updatedAppliance = await Appliance.findByIdAndUpdate(
      req.params.id,
      { name, power, importance },
      { new: true, runValidators: true }
    );

    if (!updatedAppliance) {
      throw new AppError(ERROR_TYPES.NOT_FOUND, "Прилад не знайдено");
    }

    res.status(200).json(updatedAppliance);
  } catch (error) {
    next(error);
  }
});

router.delete(`/:id`, async (req, res, next) => {
  const applianceId = req.params.id;
  try {
    const appliance = await Appliance.findByIdAndDelete(applianceId);

    if (!appliance) {
      throw new AppError(ERROR_TYPES.NOT_FOUND, "Прилад не знайдено");
    }

    return res.status(200).json({
      success: true,
      message: "The appliance was removed",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
