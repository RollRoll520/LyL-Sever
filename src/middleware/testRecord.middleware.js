const { testRecordFormatError } = require("../const/err.type");

const testRecordValidator = async (ctx, next) => {
  try {
    ctx.verifyParams({
      dataset_id: { type: "id", required: false },
      u_id: { type: "id", required: false },
    });
  } catch (err) {
    console.error(err);
    testRecordFormatError.result = err;
    return ctx.app.emit("error", testRecordFormatError, ctx);
  }
  await next();
};

module.exports = testRecordValidator;
