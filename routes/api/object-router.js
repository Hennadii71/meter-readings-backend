import express from "express";

import isEmptyBody from "../../middlewares/isEmptyBody.js";
import authenticate from "../../middlewares/authenticate.js";
import objectControllers from "../../controllers/objectControllers.js";
import isValidId from "../../middlewares/isValidId.js";

const objectRouter = express.Router();

objectRouter.use(authenticate);

objectRouter.get("/", objectControllers.getAllObjects);

objectRouter.post("/", isEmptyBody, objectControllers.createObject);

objectRouter.put(
  "/:id",
  isValidId,
  isEmptyBody,
  objectControllers.updateObject,
);

objectRouter.delete("/:id", isValidId, objectControllers.deleteObject);

export default objectRouter;
