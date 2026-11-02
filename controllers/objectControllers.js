import HttpError from "../helpers/HttpError.js";
import EstateObject from "../models/Object.js";
import { objectCreateSchema } from "../models/Object.js";

const getAllObjects = async (req, res, next) => {
  try {
    const { _id: userId } = req.user;
    const result = await EstateObject.find({ userId });
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

const createObject = async (req, res, next) => {
  try {
    const { error } = objectCreateSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { _id: userId } = req.user;
    const result = await EstateObject.create({ ...req.body, userId });
    res.status(201).json({ result });
  } catch (error) {
    next(error);
  }
};

const updateObject = async (req, res, next) => {
  try {
    const { error } = objectCreateSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const { id: _id } = req.params;
    const { _id: userId } = req.user;
    const result = await EstateObject.findByIdAndUpdate(
      { _id, userId },
      req.body,
    );
    res.status(201).json({ result });
  } catch (error) {
    next(error);
  }
};

const deleteObject = async (req, res, next) => {
  try {
    const { id: _id } = req.params;
    const { _id: userId } = req.user;
    const result = await EstateObject.findOneAndDelete({ _id, userId });
    if (!result) {
      throw HttpError(404);
    }
    res.json({ result });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllObjects,
  createObject,
  deleteObject,
  updateObject,
};
