import argparse
import pandas as pd
from joblib import dump
from lgb_model import lgb_model
import warnings

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

if __name__ == '__main__':
    warnings.filterwarnings('ignore')
    # 命令行参数解析
    parser = argparse.ArgumentParser(description='train')
    parser.add_argument('train_set_path', type=str)
    parser.add_argument('validate_set_path', type=str)
    parser.add_argument('model_path', type=str)
    parser.add_argument('train_report_path', type=str)
    parser.add_argument('train_heat_path', type=str)
    parser.add_argument('validate_report_path', type=str)
    parser.add_argument('validate_heat_path', type=str)
    args = parser.parse_args()

    # 调用函数
    mul_train(args.train_set_path, args.validate_set_path, args.model_path,
              args.train_report_path, args.train_heat_path,
              args.validate_report_path, args.validate_heat_path
              )
