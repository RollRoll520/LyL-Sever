class TrainRecordController {
  async createTrainRecord(ctx, next) {
    await next();
  }

  async updateTrainRecord(ctx, next) {
    await next();
  }
  async findTrainRecordByUid(ctx, next) {
    await next();
  }
}

module.exports = new TrainRecordController();
