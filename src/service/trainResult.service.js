const TrainResult = require("../model/trainResult.model");

class TrainResultService {
  async addTrainResult(train_record_id, modelName, modelPath) {
    const result = await TrainResult.create({
      train_record_id,
      modelName,
      modelPath,
    });
    return result.dataValues;
  }
  async getTrainResultsByRecordId(record_id) {
    const results = await TrainResult.findAll({
      where: { train_record_id: record_id },
      raw: true,
    });
    return results;
  }
}

module.exports = new TrainResultService();