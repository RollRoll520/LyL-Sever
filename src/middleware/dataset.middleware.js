const {  datasetInfoFormatError } = require("../const/err.type");

const datasetValidator = async (ctx, next) => {
  try {
    ctx.verifyParams({
      u_id: { type: "integer", required: false },
      filename: { type: "string", required: false },
      path: { type: "string", required: false },
      type: { type: "string", required: true },
      upload_time: { type: "datetime", required: false },
    });
  } catch (err) {
    console.error(err);
    datasetInfoFormatError.result = err;
    return ctx.app.emit("error", datasetInfoFormatError, ctx);
  }
  await next();
};

module.exports = {
  datasetValidator,
};
