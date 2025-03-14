const mongoose = require("mongoose");
const { Schema, model, Types } = mongoose;

// User schema
const userSchema = new Schema(
  {
    email: {
      // Пошта користувача
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      match: [/\S+@\S+\.\S+/, "Некоректна пошта"],
    },
    passwordHash: {
      // Захешований пароль
      type: String,
      required: true,
      minlength: [
        60,
        "Довжина хешу паролю повинна бути не менше ніж 60 символів",
      ],
    },
    name: {
      // Ім'я користувача
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

exports.User = model("User", userSchema);
