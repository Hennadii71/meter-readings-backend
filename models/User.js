import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, addUpdateSettings } from "./hooks.js";

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: emailRegexp,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
  },
  { timestamps: true },
);

userSchema.post("save", handleSaveError);

userSchema.pre("findOneAndUpdate", addUpdateSettings);

userSchema.post("findOneAndUpdate", handleSaveError);

export const userSignupSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().required().pattern(emailRegexp),
  password: Joi.string().required(),
});

export const userSigninSchema = Joi.object({
  email: Joi.string().required().pattern(emailRegexp),
  password: Joi.string().required().min(8),
});

const User = model("user", userSchema);

export default User;
