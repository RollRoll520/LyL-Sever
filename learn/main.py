from test_model import test_model
from train_model import train_model

# train_model('./csv/train_10000.csv', model_path='./model.joblib')
test_model('./csv/validate_1000.csv', result_file='./output/result.json', model_file='./model.joblib')

