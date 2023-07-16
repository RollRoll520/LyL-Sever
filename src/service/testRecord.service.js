const TestRecord = require("../model/testRecord.model");

class TestRecordService {
  async addTestRecord(dataset_id, remark, mode,u_id) {
    const record = await TestRecord.create({ dataset_id, remark,mode, u_id });
    return record.dataValues;
  }

  async updateTestRecord(id, end_time) {
    const record = await TestRecord.findOne({ where: { id } });
    console.log(record);
    if (!record) {
      return null;
    } else {
      await record.update({ end_time: end_time });
      const timeDiffInMs = record.end_time - record.start_time;
      return timeDiffInMs / 1000;
    }
  }

  async getUserTestRecords(uid, mode) {
    const records = await TestRecord.findAll({
      where: { u_id: uid, mode: mode },
      raw: true,
    });
    return records;
  }

    async getUserTestRecordsById(uid) {
    const records = await TestRecord.findAll({
      where: { u_id: uid},
      raw: true,
    });
    return records;
  }
}
module.exports = new TestRecordService();
