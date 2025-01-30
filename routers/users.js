const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const { Location } = require("../models/location");
const { Panel } = require("../models/panel");
const { Appliance } = require("../models/appliance");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { AppError, ERROR_TYPES } = require("../helpers/error-handler");
const { isEmailValid } = require("../utils/validation");

const secretOrPrivateKey = process.env.JWT_SECRET;
if (!secretOrPrivateKey) {
  throw new Error("JWT secret is missing or invalid");
}

router.get(`/`, async (req, res, next) => {
  try {
    const userList = await User.find().select("-passwordHash");

    if (!users.length) {
      throw new AppError(ERROR_TYPES.NOT_FOUND, "Користувачі не знайдені");
    }
    res.status(200).send(userList);
  } catch (error) {
    next(error);
  }
});

router.get(`/:id`, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");

    if (!user) {
      throw new AppError(ERROR_TYPES.NOT_FOUND, "Користувач не знайдений");
    }
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});

router.get(`/email/:email`, async (req, res, next) => {
  try {
    const email = req.params.email;

    if (!isEmailValid(email)) {
      throw new AppError(
        ERROR_TYPES.VALIDATION_ERROR,
        "Електронна пошта невірна"
      );
    }

    const userInDB = await User.findOne({ email }).select("-passwordHash");

    if (!userInDB) {
      throw new AppError(ERROR_TYPES.NOT_FOUND, "Користувач не знайдений");
    }

    return res.status(200).send(userInDB);
  } catch (error) {
    next(error);
  }
});

router.post(`/register`, async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!isEmailValid(email)) {
    throw new AppError(
      ERROR_TYPES.VALIDATION_ERROR,
      "Електронна пошта невірна"
    );
  }

  try {
    const userInDB = await User.findOne({ email: email });
    if (userInDB) {
      throw new AppError(
        ERROR_TYPES.DUPLICATE_ERROR,
        "Користувач з такою електронною поштою вже існує"
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      email: email,
      passwordHash: hashedPassword,
      name: name,
    });

    const createdUser = await user.save();

    const token = jwt.sign({ userId: createdUser.id }, secretOrPrivateKey, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "Registration successful",
      token: token,
      user: createdUser,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!isEmailValid(email)) {
      throw new AppError(
        ERROR_TYPES.VALIDATION_ERROR,
        "Електронна пошта невірна"
      );
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      throw new AppError(ERROR_TYPES.NOT_FOUND, "Користувач не знайдений");
    }

    if (user && bcrypt.compareSync(password, user.passwordHash)) {
      const token = jwt.sign({ usedId: user.id }, secretOrPrivateKey, {
        expiresIn: "7d",
      });
      return res.status(200).json({
        message: "Authentication successful",
        token: token,
        user: user,
      });
    } else {
      throw new AppError(ERROR_TYPES.VALIDATION_ERROR, "Пароль невірний");
    }
  } catch (error) {
    next(error);
  }
});

router.put(`/:id`, async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const updateFields = {
      email: email,
      name: name,
    };

    if (password) {
      const saltRounds = 10;
      updateFields.passwordHash = await bcrypt.hash(password, saltRounds);
    }

    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    ).select("-passwordHash");

    if (!updateUser) {
      throw new AppError(ERROR_TYPES.NOT_FOUND, "Користувач не знайдений");
    }
    res.status(200).send(updateUser);
  } catch (error) {
    next(error);
  }
});

router.delete(`:id`, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new AppError(ERROR_TYPES.NOT_FOUND, "Користувач не знайдений");
    }

    await User.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "The user was deleted",
      success: true,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
