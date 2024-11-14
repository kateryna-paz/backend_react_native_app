const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Panel schema
const panelTypeSchema = new Schema({
  type: {
    //Тип панелі
    type: String,
    required: true,
  },
  efficiency: {
    //  ККД панелі
    type: Number,
    required: true,
    default: 10,
  },
});

exports.PanelType = model("PanelType", panelTypeSchema);
