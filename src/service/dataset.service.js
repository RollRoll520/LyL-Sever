const Dataset = require("../model/dataset.model");
const { Op } = require("sequelize");

class DatasetService {
  async createDataset(dataset) {
    const res = await Dataset.create(dataset);
    return res.dataValues;
  }

  async findDatasetsByUidAndType(uid, type) {
    const res = await Dataset.findAll({
      where: {
        u_id: uid,
        type: type,
      },
      raw: true,
    });

    return res;
  }

  async findDatasetById(id) {
    const res = await Dataset.findOne({
      where: {
        id: id,
      },
    });
    return res ? res.dataValues : null;
  }

  //用于对datasetId进行编号
  async maxDatasetId(dateInt) {
    const maxSerial = await Dataset.findOne({
      where: {
        id: {
          [Op.startsWith]: dateInt.toString(),
        },
      },
      order: [["id", "DESC"]],
    });
    const serialNumber = maxSerial
      ? Number(String(maxSerial.id).slice(-3)) + 1
      : 1;
    return serialNumber;
  }

  async updateDatasetState(id, state) {
    const dataset = await Dataset.findOne({ where: { id } });
    if (!dataset) {
      throw new Error(`Dataset ${id} not found`);
    }
    const updatedDataset = await dataset.update({ state });
    return updatedDataset.dataValues;
  }

  async updateDatasetRemark(id, remark) {
    const dataset = await Dataset.findOne({ where: { id } });
    if (!dataset) {
      throw new Error(`Dataset ${id} not found`);
    }
    const updatedDataset = await dataset.update({ remark });
    return updatedDataset.dataValues;
  }
}

module.exports = new DatasetService();
