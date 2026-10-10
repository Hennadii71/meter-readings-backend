import HttpError from "../helpers/HttpError.js";
import User from "../models/User.js";

const getAllUsers = async (req, res, next) => {
  try {
    const result = await User.find();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllUsers,
};
