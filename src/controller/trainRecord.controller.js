const { createTrainRecordError, updateTrainRecordError } = require("../const/err.type");
const { addTrainRecord, updateTrainRecord } = require("../service/trainRecord.service");

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
        const timeDiffInSec = timeDiffInMs / 1000;

        ctx.body = {
          code: 0,
          message: "模型训练成功",
          result: `训练时间:${timeDiffInSec.toFixed(2)} 秒`,
          duration: `${timeDiffInSec.toFixed(2)}`,
        };
      } catch (err) {
        console.log(err);
        updateTrainRecordError.result = err;
        ctx.app.emit("error", updateTrainRecordError, ctx);
      }
      await next();
  }
  async findTrainRecordByUid(ctx, next) {
    await next();
  }
}

module.exports = new TrainRecordController();
