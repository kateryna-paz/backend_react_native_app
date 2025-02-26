const express = require("express");
const router = express.Router();
const { Location } = require("../models/location");
const { Region } = require("../models/region");
const { User } = require("../models/user");
const { AppError, ERROR_TYPES } = require("../helpers/error-handler");

router.get("/", async (req, res, next) => {
  try {
    const locationList = await Location.find().populate("regionId");

    if (!locationList.length) {
      throw new AppError(ERROR_TYPES.NOT_FOUND, "Локації не знайдено");
    }

    res.status(200).json(locationList);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const location = await Location.findById(req.params.id).populate(
      "regionId"
    );

    if (!location) {
      throw new AppError(ERROR_TYPES.NOT_FOUND, "Локацію не знайдено");
    }

    res.status(200).json(location);
  } catch (error) {
    next(error);
  }
});

router.get("/userId/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;

    const location = await Location.findOne({ userId }).populate("regionId");

    if (!location) {
      return res
        .status(200)
        .json({ message: "Для цього користувача немає локації" });
    }

    res.status(200).json(location);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { regionName, coordinates, dailyEnergyProduced, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(ERROR_TYPES.NOT_FOUND, "Користувача не знайдено");
    }

    const region = await Region.findOne({ name: regionName });
    if (!region) {
      throw new AppError(ERROR_TYPES.NOT_FOUND, "Регіон не знайдено");
    }

    const locationUser = await Location.findOne({ userId });
    if (locationUser) {
      throw new AppError(
        ERROR_TYPES.DUPLICATE_ERROR,
        "Користувач вже має локацію"
      );
    }

    const location = new Location({
      regionId: region._id,
      coordinates,
      dailyEnergyProduced,
      userId,
    });
    const createdLocation = await location.save();

    const populatedLocation = await Location.findById(
      createdLocation._id
    ).populate("regionId");

    res.status(201).json(populatedLocation);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { regionName, coordinates, dailyEnergyProduced, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(ERROR_TYPES.NOT_FOUND, "Користувача не знайдено");
    }

    const region = await Region.findOne({ name: regionName });
    if (!region) {
      throw new AppError(ERROR_TYPES.NOT_FOUND, "Регіон не знайдено");
    }

    const updatedLocation = await Location.findByIdAndUpdate(
      req.params.id,
      {
        regionId: region._id,
        coordinates,
        $push: { dailyEnergyProduced },
      },
      { new: true }
    ).populate("regionId");

    if (!updatedLocation) {
      throw new AppError(ERROR_TYPES.NOT_FOUND, "Локацію не знайдено");
    }

    res.status(200).json(updatedLocation);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deletedLocation = await Location.findByIdAndDelete(req.params.id);

    if (!deletedLocation) {
      throw new AppError(ERROR_TYPES.NOT_FOUND, "Локацію не знайдено");
    }

    res
      .status(200)
      .json({ success: true, message: "The location was deleted" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
