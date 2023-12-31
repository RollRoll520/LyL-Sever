const TestResult = require("../model/testResult.model");

class TestResultService {
  async addTestResult(test_record_id, filename, category,path) {
    const result = await TestResult.create({
      test_record_id,
      filename,
      path,
      category_path:category
    });
    return result.dataValues;
  }
  async getTestResultsByRecordId(record_id) {
    const results = await TestResult.findOne({
      where: { test_record_id: record_id },
      raw: true,
    });
    return results;
  }
}

module.exports = new TestResultService();
