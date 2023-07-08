const Dataset = require("../model/dataset.model");

class DatasetService {
  async createDataset(dataset) {
    const res = await Dataset.create(dataset);
    return res.dataValues;
  }
}

module.exports = new DatasetService();
