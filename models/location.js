const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

// Location schema
const locationSchema = new Schema({
  regionId: {
    // Посилання на документ у колекції regions
    type: Types.ObjectId,
    ref: "Region",
    required: true,
  },
  userId: {
    // Посилання на документ у колекції users
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  coordinates: {
    // Координати місця
    type: [Number],
    required: true,
    validate: {
      validator: (coords) => coords.length === 2,
      message:
        "Координати повинні містити рівно 2 елементи: [широта, довгота].",
    },
  },
  dailyEnergyProduced: {
    type: [
      {
        date: { type: Date, default: Date.now }, // Дата
        energy: {
          type: Number,
          min: [0, "Вироблена енергія повинна бути більша за 0"], // Вироблена енергія у Вт
          required: true,
        },
      },
    ],
    default: [],
  },
});

locationSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

locationSchema.set("toJSON", {
  virtuals: true,
});

exports.Location = model("Location", locationSchema);
