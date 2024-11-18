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

panelTypeSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

panelTypeSchema.set("toJSON", {
  virtuals: true,
});

exports.PanelType = model("PanelType", panelTypeSchema);
