from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import SGDClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
import json
import psycopg2
import random
import pickle
import sys
import os

CLASS_SIZE = 10

ENV = 'development'
SESSION_ID = sys.argv[1]
print('#node:Python Started', ENV, SESSION_ID)

# TODO
# Retrieve trained table for user
# update format expenses method
# refactor code

# db methods


def connect(env='development'):
    with open('config/config.json') as file:
        data = file.read()
    conn = json.loads(data)[env]
    conn_string = f"host='{conn['host']}' dbname='{conn['database']}' user='{conn['username']}' password='{conn['password']}'"
    return psycopg2.connect(conn_string)


def getModel():
    connection = connect()
    with connection.cursor() as curs:
        curs.execute(
            'SELECT model FROM category_classifier WHERE category_classifier.user_id = ' +
            '(SELECT prediction_session.user_id FROM prediction_session WHERE id = %s);', [SESSION_ID])
        model = curs.fetchone()
    # Making assumption that the process will sucessfully retrieve a single model
    # Need some checks here
    return pickle.loads(model[0])


def getExpenses():
    connection = connect()
    with connection.cursor() as curs:
        curs.execute(
            'SELECT id, amount, date, store_id FROM cat_classifier_predictions WHERE session_id = %s;', [SESSION_ID])
        expenses = curs.fetchall()
    return expenses


def saveClassDefinitions(classes):
    connection = connect()
    formatted = [int(c) for c in classes]
    with connection.cursor() as curs:
        curs.execute(
            'UPDATE prediction_session SET classes = %s ' +
            ' WHERE id = %s;', (formatted, SESSION_ID))
        connection.commit()


def savePredictions(ids, predictions):
    connection = connect()
    formatted = []
    for prediction in predictions:
        formatted.append([float(p) for p in prediction])
    with connection.cursor() as curs:
        for (id, prediction) in zip(ids, formatted):
            print(id, prediction)
            print(type(id), type(prediction))
            curs.execute(
                'UPDATE cat_classifier_predictions SET predictions = %s ' +
                ' WHERE id = %s;', (prediction, id))
        connection.commit()


def formatExpenses(expenses):
    ids = []
    result = []
    for expense in expenses:
        # 0 - id, 1 - amount, 2 - date, 3 - store_id
        # Date not currently used
        ids.append(expense[0])
        result.append([expense[1], -1 if expense[3] == None else expense[3]])
    return (ids, result)


def main():
    # MAIN BODY
    (ids, expenses) = formatExpenses(getExpenses())
    model = getModel()

    # save class definitions
    saveClassDefinitions(model.classes_)
    # get predictions
    predictions = model.predict_proba(expenses)
    # save predictions
    savePredictions(ids, predictions)
    # print(predictions)


main()
