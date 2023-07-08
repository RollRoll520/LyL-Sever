const TestRecord = require("../model/testRecord.model");

class TestRecordService {
  async addTestRecord(dataset_id, u_id) {
    const record = await TestRecord.create({ dataset_id, u_id });
    return record.dataValues;
  }

  async updateTestRecord(id, end_time) {
    const record = await TestRecord.findByPk(id);
    if (!record) {
      return null;
    } else {
      await record.update({ end_time });
      return record.dataValues;
    }
  }

  async getUserTestRecords(uid) {
    const records = await TestRecord.findAll({
      where: { u_id: uid },
    });
    return records.dataValues;
  }
}
module.exports = new TestRecordService;
