const TrainRecord = require("../model/trainRecord.model");

class TrainRecordService {
  async addTrainRecord(train_set_id, validate_set_id, u_id, remark) {
    const record = await TrainRecord.create({
      train_set_id,
      validate_set_id,
      u_id,
      remark,
    });
    return record.dataValues;
  }

  async updateTrainRecord(test_id, end_time) {
    const record = await TrainRecord.findOne({ where: { id:test_id } });
    console.log(record);
    if (!record) {
      return null;
    } else {
      await record.update({ end_time: end_time });
      const timeDiffInMs = record.end_time - record.start_time;
      return timeDiffInMs/1000;
    }
  }

  async getUserTrainRecords(uid) {
    const records = await TrainRecord.findAll({
      where: { u_id: uid },
      raw: true,
    });
    return records;
  }
}
module.exports = new TrainRecordService();
