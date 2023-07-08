import argparse
import json
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report
from joblib import load


def test_preprocess(data):
    # 缺失值处理
    data.fillna(0, inplace=True)

    # 划分
    x_test = data.iloc[:, 1:-1].values
    y_test = data.iloc[:, -1].values

    # 标准化
    scaler = StandardScaler()
    x_test = scaler.fit_transform(x_test)

    return x_test, y_test


def test_model(test_set_path: str, result_file: str, model_file: str):
    """
    应用训练好的模型对测试样本进行结果预测。

    :param test_set_path: 测试集文件路径
    :param result_file: 测试结果文件，以json文件形式保存
    :param model_file: 模型文件路径
    :return:
    """

    # 加载模型
    model = load(model_file)

    # 加载测试集
    data_test = pd.read_csv(test_set_path)

    # 数据预处理
    x_test, y_test = test_preprocess(data_test)

    # 进行预测
    y_pred = model.predict(x_test)

    # 评估模型
    # report = classification_report(y_test, y_pred)
    # print(report)

    # 创建字典
    keys = np.array(range(0, y_test.shape[0]))
    values = y_pred.flatten().astype(int)
    items = zip(keys, values)
    my_dict = {int(k): int(v) for k, v in items}

    # 保存结果
    with open(result_file, 'w') as f:
        json.dump(my_dict, f)


if __name__ == '__main__':
    # 命令行参数解析
    parser = argparse.ArgumentParser(description='Test a machine learning model.')
    parser.add_argument('test_set_path', type=str, help='path to the test set')
    parser.add_argument('result_file', type=str, help='path to the result file')
    parser.add_argument('model_file', type=str, default='./trained_model.joblib', help='path to the model file')
    args = parser.parse_args()

    # 调用主函数
    test_model(args.test_set_path, args.result_file, args.model_file)