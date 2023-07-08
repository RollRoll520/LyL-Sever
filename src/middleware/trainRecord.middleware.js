const { trainRecordFormatError } = require("../const/err.type");

const trainRecordValidator = async (ctx, next) => {
  try {
    ctx.verifyParams({
      dataset_id: { type: "integer", required: false },
      u_id: { type: "integer", required: false },
    });
  } catch (err) {
    console.error(err);
    trainRecordFormatError.result = err;
    return ctx.app.emit("error", trainRecordFormatError, ctx);
  }
  await next();
};

module.exports = trainRecordValidator;
