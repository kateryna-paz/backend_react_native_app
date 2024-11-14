const mongoose = require("mongoose");
const { Schema, model } = mongoose;

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
});

exports.Appliance = model("Appliance", applianceSchema);
