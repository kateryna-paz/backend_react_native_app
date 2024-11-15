const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

// Panel schema
const panelSchema = new Schema({
  square: {
    // Площа панелі
    type: Number,
    required: true,
    min: [0.1, "Площа панелі не може бути менша за 0.1"],
    default: 1,
  },
  number: {
    // Кількість панелей
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
  typeId: {
    // Посилання на документ у колекції paneltypes
    type: Types.ObjectId,
    ref: "PanelType",
    required: true,
  },
});

exports.Panel = model("Panel", panelSchema);
