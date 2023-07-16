const TrainResult = require("../model/trainResult.model");
const path = require("path");

class TrainResultService {
  async addTrainResult(
    train_record_id,
    model_path,
    train_report_path,
    train_heat_path,
    validate_report_path,
    validate_heat_path
  ) {
    const result = await TrainResult.create({
      train_record_id,
      model_name: path.basename(model_path),
      model_path,
      train_report_path,
      train_heat_path,
      validate_report_path,
      validate_heat_path,
    });
    return result.dataValues;
  }
  async getTrainResultsByRecordId(record_id) {
    const results = await TrainResult.findOne({
      where: { train_record_id: record_id },
      raw: true,
    });
    return results;
  }
}

module.exports = new TrainResultService();