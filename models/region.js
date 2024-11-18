const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const regionSchema = new Schema({
  name: {
    // Назва області
    type: String,
    required: true,
  },
  monthlyInsolation: {
    // Інсоляція на кожен місяць
    type: [Number],
    required: true,
  },
  yearlyInsolation: {
    // Річна інсоляція
    type: Number,
    required: true,
  },
});

regionSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

regionSchema.set("toJSON", {
  virtuals: true,
});


exports.Region = model("Region", regionSchema);
