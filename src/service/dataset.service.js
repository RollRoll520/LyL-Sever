const Dataset = require("../model/dataset.model");

class DatasetService {
  async createDataset(dataset) {
    const res = await Dataset.create(dataset);
    return res.dataValues;
  }

  async findLatestDatasetByUidAndType(uid, type) {
    const res = await Dataset.findOne({
      where: {
        u_id: uid,
        type: type,
      },
      order: [["upload_time", "DESC"]],
    });

    return res.dataValues;
  }
}

module.exports = new DatasetService();
