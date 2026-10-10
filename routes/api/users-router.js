import express from "express";
import isEmptyBody from "../../middlewares/isEmptyBody.js";
import usersControllers from "../../controllers/usersControllers.js";

const usersRouter = express.Router();

usersRouter.get("/", usersControllers.getAllUsers);

export default usersRouter;
