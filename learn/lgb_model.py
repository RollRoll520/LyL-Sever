import json
import numpy as np
import lightgbm as lgb
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_selection import SelectKBest, chi2, SelectFromModel
from sklearn.metrics import confusion_matrix, classification_report, f1_score
from sklearn.preprocessing import MinMaxScaler


class lgb_model:
    def __init__(self):
        self.params = {
            'boosting_type': 'gbdt',
            'objective': 'multiclass',
            # 'metric': 'multi_logloss',
            'num_class': 6,
            'num_leaves': 5,
            'learning_rate': 0.01,
            "lambda_l1": 0.5,
            "lambda_l2": 0.5,
            'feature_fraction': 0.9,
            'bagging_fraction': 0.8,
            'bagging_freq': 5,
            'verbose': -1
        }
        self.fillna_value = 0
        self.model = None
        self.scaler = None
        self.select = None
        self.bad_cols = ['feature57', 'feature77', 'feature100']
        np.random.seed(42)

    def train_model(self, data_train, data_valid):
        # 先对数据进行预处理
        # 删除重复数据
        data_train = data_train.iloc[:, 1:].drop_duplicates()
        # 删除无用特征
        data_train = data_train.drop(self.bad_cols, axis=1)
        # print(data_train.shape)
        # 填充缺失值
        mean_value = data_train.median(axis=0)
        self.fillna_value = mean_value
        data_train.fillna(mean_value, inplace=True)
        # 异常值处理
        for label in data_train.columns[:-1]:
            data_train[label] = lgb_model.fill(data_train[label])
        # 划分数据
        X_train, y_train = data_train.iloc[:, :-1].values, data_train.iloc[:, -1].values
        # 标准化
        self.scaler = MinMaxScaler()
        X_train = self.scaler.fit_transform(X_train)
        # 特征筛选
        clf = RandomForestClassifier()
        self.select = SelectFromModel(clf, threshold='mean')
        X_train = self.select.fit_transform(X_train, y_train)


        weights = np.ones(len(y_train))
        weights[y_train == 0] = 0.9
        weights[y_train == 1] = 1.55
        weights[y_train == 2] = 1.8
        weights[y_train == 3] = 2.3
        weights[y_train == 4] = 1
        weights[y_train == 5] = 1

        train_data = lgb.Dataset(X_train, label=y_train,weight=weights)

        # 处理验证集
        data_valid = data_valid.drop(self.bad_cols, axis=1)
        data_valid.fillna(mean_value, inplace=True)
        X_valid, y_valid = data_valid.iloc[:, 1:-1].values, data_valid.iloc[:, -1].values
        X_valid = self.scaler.transform(X_valid)
        X_valid = self.select.transform(X_valid)
        val_data = lgb.Dataset(X_valid, label=y_valid)

        self.model = lgb.train(self.params, train_data, valid_sets=[train_data, val_data], num_boost_round=600,
                          callbacks=[lgb.early_stopping(10)])


    def predict(self, data_test):
        data_test = data_test.drop(self.bad_cols, axis=1)
        data_test.fillna(self.fillna_value, inplace=True)

        if 'sample_id' in data_test.columns:
            data_test.drop('sample_id', axis=1, inplace=True)
        if 'label' in data_test.columns:
            data_test.drop('label', axis=1, inplace=True)

        X_test = data_test.iloc[:, :]
        X_test = self.scaler.transform(X_test)
        X_test = self.select.transform(X_test)

        preds = self.model.predict(X_test)
        y_pred_test = [list(x).index(max(x)) for x in preds]

        return y_pred_test

    @staticmethod
    def save_preds(sample_id, preds, file_path):
        # 创建字典
        items = zip(sample_id, preds)
        my_dict = {int(k): int(v) for k, v in items}

        # 保存结果
        with open(file_path, 'w') as f:
            json.dump(my_dict, f)

    @staticmethod
    def save_confusion_matrix(y_true, y_pred, file_path):
        cm = confusion_matrix(y_true, y_pred)
        json_cm = []
        for row in range(0, 6):
            for col in range(0, 6):
                json_cm.append({'row': 'label' + str(row), 'col': 'label' + str(col), 'value': (int)(cm[row][col])})

        with open(file_path, 'w') as f:
            json.dump(json_cm, f)

    @staticmethod
    def save_report(y_true, y_pred, file_path):
        report = classification_report(y_true, y_pred, output_dict=True)
        report_dict = []
        for key in list(report.keys())[:6]:
            report_dict.append(
                {'key': key, 'category': key, "precision": report[key]['precision'], "recall": report[key]['recall'],
                 "f1-score": report[key]['f1-score'], "support": report[key]['support']})

        report_dict.append(
            {"key": "accuracy", "category": "accuracy", "precision": "", "recall": "", "f1-score": report['accuracy'],
             "support": report['macro avg']['support']})
        report_dict.append({"key": "macro-avg", "category": "macro avg", "precision": report['macro avg']['precision'],
                     "recall": report['macro avg']['recall'], "f1-score": report['macro avg']['f1-score'],
                     "support": report['macro avg']['support']})
        report_dict.append(
            {"key": "weighted-avg", "category": "weighted avg", "precision": report['weighted avg']['precision'],
             "recall": report['weighted avg']['recall'], "f1-score": report['weighted avg']['f1-score'],
             "support": report['weighted avg']['support']})

        with open(file_path, 'w') as f:
            json.dump(report_dict, f)

    @staticmethod
    def save_category(y_pred, file_path):
        mydict = {}
        counts = np.zeros(6)
        for i in y_pred:
            counts[i] += 1
        mydict = [
            {'label': 0, 'count': counts[0]},
            {'label': 1, 'count': counts[1]},
            {'label': 2, 'count': counts[2]},
            {'label': 3, 'count': counts[3]},
            {'label': 4, 'count': counts[4]},
            {'label': 5, 'count': counts[5]},
        ]

        with open(file_path, 'w') as f:
            json.dump(mydict, f)

    @staticmethod
    def fill(col):
        mean = col.mean()
        std = col.std()
        upper_bound = mean + 3 * std
        lower_bound = mean - 3 * std
        def trans(x):
            if x > upper_bound:
                return upper_bound
            elif x < lower_bound:
                return lower_bound
            else:
                return xß
        return col.map(trans)


