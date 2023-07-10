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
    const { dataset_id } = ctx.state;
    const { id: u_id } = ctx.state.user;
    try {
      const res = await addTrainRecord(dataset_id, u_id);
      ctx.state.record_id = res.id;
    } catch (err) {
      console.log(err);
      createTrainRecordError.result = err;
      ctx.app.emit("error", createTrainRecordError, ctx);
    }

    await next();
  }

  async updateTrainRecord(ctx, next) {
    const { record_id } = ctx.state;
    try {
      const now = new Date().getTime();
      const res = await updateTrainRecord(record_id, now);

      const timeDiffInMs = res.end_time - res.start_time;
      ctx.state.duration = timeDiffInMs / 1000;
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
