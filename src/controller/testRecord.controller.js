const {
  createTestRecordError,
  updateTestRecordError,
  getTestRecordError,
} = require("../const/err.type");
const {
  addTestRecord,
  updateTestRecord,
  getUserTestRecords,
} = require("../service/testRecord.service");

class TestRecordController {
  async createTestRecord(ctx, next) {
    const { dataset_id,remark,mode } = ctx.request.body;
    const { id: u_id } = ctx.state.user;
    try {
      const res = await addTestRecord(dataset_id, remark,mode,u_id);
      ctx.state.record_id = res.id;
      await next();
    } catch (err) {
      console.log(err);
      createTestRecordError.result = err;
      ctx.app.emit("error", createTestRecordError, ctx);
    }
  }

  async updateTestRecord(ctx, next) {
    try {
      const now = Date.now();
      const res = await updateTestRecord(ctx.state.record_id, now);
      ctx.state.duration = res;
      await next();
    } catch (err) {
      console.log(err);
      updateTestRecordError.result = err;
      ctx.app.emit("error", updateTestRecordError, ctx);
    }
  }
  async findTestRecordByUid(ctx, next) {
    const { id: u_id } = ctx.state.user;
    try {
      const res = await getUserTestRecords(u_id,ctx.state.mode);
      ctx.body = {
        code: 0,
        message: "获取测试记录成功",
        result: res,
        count: res.length,
      };
      await next();
    } catch (err) {
      console.log(err);
      getTestRecordError.result = err;
      ctx.app.emit("error", getTestRecordError, ctx);
    }
  }
}

module.exports = new TestRecordController();
