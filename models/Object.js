import { Schema, model } from "mongoose";
import Joi from "joi";
import { handleSaveError, addUpdateSettings } from "./hooks.js";

const objectSchema = new Schema(
  {
    objectName: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true },
);

objectSchema.post("save", handleSaveError);

objectSchema.pre("findOneAndUpdate", addUpdateSettings);

objectSchema.post("findOneAndUpdate", handleSaveError);

export const objectCreateSchema = Joi.object({
  objectName: Joi.string().required(),
});

const EstateObject = model("estate-object", objectSchema);

export default EstateObject;
