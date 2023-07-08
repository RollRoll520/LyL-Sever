const {
  createTestRecordError,
  updateTestRecordError,
} = require("../const/err.type");
const {
  addTestRecord,
  updateTestRecord,
} = require("../service/testRecord.service");

class TestRecordController {
  async createTestRecord(ctx, next) {
    const { dataset_id } = ctx.state;
    const { id: u_id } = ctx.state.user;
    try {
      const res = await addTestRecord(dataset_id, u_id);
      ctx.state.record_id = res.id;
    } catch (err) {
      console.log(err);
      createTestRecordError.result = err;
      ctx.app.emit("error", createTestRecordError, ctx);
    }

    await next();
  }

  async updateTestRecord(ctx, next) {
    const { record_id } = ctx.state;
    try {
      const now = new Date().getTime();
      const res = await updateTestRecord(record_id, now);

      const timeDiffInMs = res.end_time - res.start_time;
      const timeDiffInSec = timeDiffInMs / 1000;

      ctx.body = {
        code: 0,
        message: "模型测试成功",
        result: `测试时间:${timeDiffInSec.toFixed(2)} 秒`,
        duration: `${timeDiffInSec.toFixed(2)}`,
      };
    } catch (err) {
      console.log(err);
      updateTestRecordError.result = err;
      ctx.app.emit("error", updateTestRecordError, ctx);
    }
    await next();
  }
  async findTestRecordByUid(ctx, next) {
    await next();
  }
}

module.exports = new TestRecordController();
