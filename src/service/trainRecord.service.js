const TrainRecord = require("../model/TrainRecord");

class TrainRecordService {
  async addRecord(dataset_id, u_id) {
    const record = await TrainRecord.create({ dataset_id, u_id });
    return record;
  }

  async updateRecord(id, end_time) {
    const record = await TrainRecord.findByPk(id);
    if (!record) {
      return null;
    } else {
      await record.update({ end_time });
      return record;
    }
  }

  async getUserRecords(uid) {
    const records = await TrainRecord.findAll({
      where: { u_id: uid },
    });
    return records;
  }
}
module.exports = new TrainRecordService();
