const TestRecord = require("../model/TestRecord");

class TestRecordService {
  async addRecord(dataset_id, u_id) {
    const record = await TestRecord.create({ dataset_id, u_id });
    return record;
  }

  async updateRecord(id, end_time) {
    const record = await TestRecord.findByPk(id);
    if (!record) {
      return null;
    } else {
      await record.update({ end_time });
      return record;
    }
  }

  async getUserRecords(uid) {
    const records = await TestRecord.findAll({
      where: { u_id: uid },
    });
    return records;
  }
}
module.exports = new TestRecordService;
