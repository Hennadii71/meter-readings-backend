export const handleSaveError = (error, data, next) => {
  const { name, code } = error;
  error.status = name === "MongoServerError" && code === 11000 ? 409 : 400;
  next(error);
};

export const addUpdateSettings = async function () {
  this.options = this.options || {};
  this.options.returnDocument = "after";
  this.options.runValidators = true;
};
