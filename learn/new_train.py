import pandas as pd
from joblib import dump, load
from lgb_model import lgb_model

def mul_train(train_set_path: str, validate_set_path: str, model_path: str,
              train_report_path: str, train_heat_path: str,
              validate_report_path: str, validate_heat_path: str):
    """
    用训练数据和验证进行模型训练，并将模型保存。

    :param train_set_path:    训练集
    :param validate_set_path:    训练集
    :param model_path:  保存的模型文件路径
    :param train_report_path:    保存训练集报告文件路径
    :param train_heat_path:  保存训练集热力图数据文件路径
    :param validate_report_path:    保存验证集报告文件路径
    :param validate_heat_path:  保存验证集热力图数据文件路径
    :return:
    """
    # 读取数据
    data_train = pd.read_csv(train_set_path)
    data_val = pd.read_csv(validate_set_path)

    # 创建模型并训练
    model = lgb_model()
    model.train_model(data_train, data_val)

    # 预测
    y_train_pred = model.predict(data_train.iloc[:, :-1])
    y_val_pred = model.predict(data_val.iloc[:, :-1])

    # 保存report与热力图
    model.save_report(data_train.iloc[:, -1].values, y_train_pred, train_report_path)
    model.save_confusion_matrix(data_train.iloc[:, -1].values, y_train_pred, train_heat_path)
    model.save_report(data_val.iloc[:, -1].values, y_val_pred, validate_report_path)
    model.save_confusion_matrix(data_val.iloc[:, -1].values, y_val_pred, validate_heat_path)

    # 保存模型
    dump(model, model_path)

def test_model(test_set_path: str, result_file: str, model_file: str = "./trained_model.joblib"):
    """
    应用训练好的模型对测试样本进行结果预测。

    :param test_set_path: 测试集文件路径
    :param result_file: 测试结果文件，以json文件形式保存
    :param model_file:  模型文件
    :return:
    """
    # 读取数据
    data_test = pd.read_csv(test_set_path)

    # 加载模型
    model = load(model_file)

    # 进行预测
    y_test_pred = model.predict(data_test)

    # 保存结果
    model.save_preds(data_test.iloc[:, 0], y_test_pred, result_file)


dataset_path = '../static/train_10000.csv'
validata_set_path = '../static/validate_1000.csv'
test_set_path = '../static/test_2000_x.csv'

model_path = '../static/model/model1.joblib'
train_report_path = '../static/report/report_train.json'
validata_report_path = '../static/report/report_val.json'
train_heat_path = '../static/heat/heat_heat_train.json'
validata_heat_path = '../static/heat/heat_val.json'


# mul_train(dataset_path, validata_set_path, model_path, train_report_path, train_heat_path, validata_report_path, validata_heat_path)
test_model(validata_set_path, '../static/result/valid.json', model_path)
