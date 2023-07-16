import argparse
import warnings

import pandas as pd
from joblib import load
from lgb_model import lgb_model


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

if __name__ == '__main__':
    warnings.filterwarnings('ignore')
    # 命令行参数解析
    parser = argparse.ArgumentParser(description='train')
    parser.add_argument('test_set_path', type=str)
    parser.add_argument('result_file', type=str)
    parser.add_argument('model_file', type=str)
    args = parser.parse_args()

    # 调用函数
    test_model(args.test_set_path, args.result_file, args.model_file)

