const TestResult = require("../model/testResult.model");

class TestResultService {
  async addTestResult(test_record_id, filename, path) {
    const result = await TestResult.create({
      test_record_id,
      filename,
      path,
    });
    return result.dataValues;
  }
  async getTestResultsByRecordId(record_id) {
    const results = await TestResult.findAll({
      where: { test_record_id: record_id },
      raw: true,
    });
    return results;
  }
}

module.exports = new TestResultService();
