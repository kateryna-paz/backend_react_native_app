const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

const importanceType = {
  high: "висока",
  medium: "середня",
  low: "низька",
};

const applianceSchema = new Schema({
  name: {
    // Назва приладу
    type: String,
    required: true,
  },
  power: {
    // Значення потужності
    type: Number,
    required: true,
    min: [0, "Значення потужності повинно бути більшим за 0"],
    max: [5000, "Значення потужності повинно бути меншим за 5000"], // Максимальна потужність приладу у Вт
  },
  importance: {
    // Рівень важливості приладу
    type: String,
    enum: Object.values(importanceType),
    required: true,
    default: importanceType.medium,
  },
  userId: {
    // Посилання на документ у колекції users
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
});

applianceSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

applianceSchema.set("toJSON", {
  virtuals: true,
});

exports.Appliance = model("Appliance", applianceSchema);
