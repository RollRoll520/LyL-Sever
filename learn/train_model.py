import argparse
import pandas as pd
from sklearn.metrics import classification_report
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from joblib import dump


def train_preprocess(data):
    # 数据预处理
    # 依次进行缺失值处理、标准化等

    # 缺失值处理
    mean_value = data.median(axis=0)
    data.fillna(mean_value, inplace=True)

    # 划分训练集和测试集
    x_train = data.iloc[:, 1:-1].values
    y_train = data.iloc[:, -1].values

    # 特征缩放
    scaler = StandardScaler()
    x_train = scaler.fit_transform(x_train)

    return x_train, y_train


def train_model(dataset_path: str, model_path: str):
    """
    用训练数据进行模型训练，并将模型保存。

    :param dataset_path:    训练集
    :param model_path:  保存的模型文件路径
    :return:
    """

    # 读入训练集
    data_train = pd.read_csv(dataset_path)

    # 预处理
    x_train, y_train = train_preprocess(data_train)

    # 创建决策森林模型
    rf = RandomForestClassifier(n_estimators=125)

    # 训练模型
    rf.fit(x_train, y_train)

    # 进行预测
    y_pred = rf.predict(x_train)

    # 评估模型
    # report = classification_report(y_train, y_pred)
    # print(report)

    # 保存模型
    dump(rf, model_path)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Train a random forest classifier.')
    parser.add_argument('dataset', metavar='dataset', type=str,
                        help='path to the training dataset')
    parser.add_argument('model', metavar='model', type=str,
                        help='path to save the trained model')
    args = parser.parse_args()

    train_model(args.dataset, args.model)