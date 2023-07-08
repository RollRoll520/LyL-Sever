const TrainRecord = require("../model/trainRecord.model");

class TrainRecordService {
  async addTrainRecord(dataset_id, u_id) {
    const record = await TrainRecord.create({ dataset_id, u_id });
    return record.dataValues;
  }

  async updateTrainRecord(id, end_time) {
    const record = await TrainRecord.findByPk(id);
    if (!record) {
      return null;
    } else {
      await record.update({ end_time });
      return record.dataValues;
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
