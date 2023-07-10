const {
  datasetInfoFormatError,
  unlinkDatasetFormatError,
} = require("../const/err.type");

const datasetValidator = async (ctx, next) => {
  try {
    ctx.verifyParams({
      u_id: { type: "id", required: false },
      filename: { type: "string", required: false },
      path: { type: "string", required: false },
      type: { type: "string", required: true },
      remark: { type: "string", required: false },
      state: { type: "string", required: false },
      upload_time: { type: "datetime", required: false },
    });
  } catch (err) {
    console.error(err);
    datasetInfoFormatError.result = err;
    return ctx.app.emit("error", datasetInfoFormatError, ctx);
  }
  await next();
};

const unlinkDatasetValidator = async (ctx, next) => {
  try {
    ctx.verifyParams({
      id: { type: "id", required: true },
    });
    await next();
  } catch (err) {
    console.log(err);
    unlinkDatasetFormatError.result = err;
    ctx.app.emit("error", unlinkDatasetFormatError, ctx);
  }
};

module.exports = {
  datasetValidator,
  unlinkDatasetValidator,
};
