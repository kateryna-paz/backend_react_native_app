const express = require("express");
const router = express.Router();
const { Region } = require("../models/region");
const { AppError, ERROR_TYPES } = require("../helpers/error-handler");

router.get(`/`, async (req, res, next) => {
  try {
    const regionList = await Region.find();

    if (!regionList.length) {
      throw new AppError(ERROR_TYPES.NOT_FOUND, "Жодної області не знайдено");
    }
    res.send(regionList);
  } catch (error) {
    next(error);
  }
});

router.get(`/names`, async (req, res, next) => {
  try {
    const regionList = await Region.find().select("name");

    if (!regionList || regionList.length === 0) {
      throw new AppError(ERROR_TYPES.NOT_FOUND, "Жодної області не знайдено");
    }
    res.send(regionList);
  } catch (error) {
    next(error);
  }
});

router.get(`/:id`, async (req, res, next) => {
  try {
    const region = await Region.findById(req.params.id);

    if (!region) {
      throw new AppError(ERROR_TYPES.NOT_FOUND, "Область не знайдена");
    }
    res.send(region);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
