const {
  createTrainRecordError,
  updateTrainRecordError,
  getTrainRecordError,
} = require("../const/err.type");
const {
  addTrainRecord,
  updateTrainRecord,
  getUserTrainRecords,
} = require("../service/trainRecord.service");

class TrainRecordController {
  async createTrainRecord(ctx, next) {
    const { train_set_id, validate_set_id ,remark} = ctx.request.body;
    const { id: u_id } = ctx.state.user;
    try {
      const res = await addTrainRecord(train_set_id, validate_set_id, u_id,remark);
      ctx.state.record_id = res.id;
    } catch (err) {
      console.log(err);
      createTrainRecordError.result = err;
      ctx.app.emit("error", createTrainRecordError, ctx);
    }

    await next();
  }

  async updateTrainRecord(ctx, next) {
    try {
      const now = Date.now();
      const res = await updateTrainRecord(ctx.state.record_id, now);
      console.log(res);
      ctx.state.duration = res;
      await next();
    } catch (err) {
      console.log(err);
      updateTrainRecordError.result = err;
      ctx.app.emit("error", updateTrainRecordError, ctx);
    }
  }
  async findTrainRecordByUid(ctx, next) {
    const { id: u_id } = ctx.state.user;
    try {
      const res = await getUserTrainRecords(u_id);
      ctx.body = {
        code: 0,
        message: "获取训练记录成功",
        result: res,
        count: res.length,
      };
      await next();
    } catch (err) {
      console.log(err);
      getTrainRecordError.result = err;
      ctx.app.emit("error", getTrainRecordError, ctx);
    }
  }
}

module.exports = new TrainRecordController();
