from sklearn.feature_extraction.text import CountVectorizer
from sklearn.pipeline import make_pipeline
import prediction_utility
import db_manager
import pickle
import sys

CLASS_SIZE = 10

ENV = sys.argv[1]
SESSION_ID = sys.argv[2]
print('#node:Python Started', ENV, SESSION_ID)


def getModel():
    connection = db_manager.connect()
    with connection.cursor() as curs:
        curs.execute(
            'SELECT model FROM category_classifier WHERE category_classifier.user_id = ' +
            '(SELECT prediction_session.user_id FROM prediction_session WHERE id = %s);', [SESSION_ID])
        model = curs.fetchone()
    # Making assumption that the process will sucessfully retrieve a single model
    # Need some checks here
    return pickle.loads(model[0])


def getExpenses():
    connection = db_manager.connect()
    with connection.cursor() as curs:
        curs.execute(
            'SELECT amount, date, store, id FROM cat_classifier_predictions WHERE session_id = %s;', [SESSION_ID])
        expenses = curs.fetchall()
    return expenses

# region :Text vectorization


def getLetterCombinations():
    # generate all possible permutations of letters
    letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
               'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    return [letter+letter2 for letter2 in letters for letter in letters]


def build_vectorizer(texts):
    vectorizer = CountVectorizer(analyzer='char', ngram_range=(2, 2))
    # returns document-term matrix
    X = vectorizer.fit_transform(texts)
    print(len(X.toarray()))
    return vectorizer
# endregion


def saveClassDefinitions(classes):
    connection = db_manager.connect()
    formatted = [int(c) for c in classes]
    with connection.cursor() as curs:
        curs.execute(
            'UPDATE prediction_session SET classes = %s ' +
            ' WHERE id = %s;', (formatted, SESSION_ID))
        connection.commit()


def savePredictions(ids, predictions):
    connection = db_manager.connect()
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


def formatExpenses(expenses, store_vectorizer):
    ids = []
    result = []
    print(expenses)
    for expense in expenses:
        # 0: amount, 1: date, 2: store_id, 3: id
        # Date not currently used
        ids.append(expense[3])
        result.append(prediction_utility.format_expense(
            expense, store_vectorizer))
    return (ids, result)


def main():
    # MAIN BODY
    (ids, expenses) = formatExpenses(getExpenses(),
                                     build_vectorizer(getLetterCombinations()))
    model = getModel()

    # save class definitions
    saveClassDefinitions(model.classes_)
    # get predictions
    predictions = model.predict_proba(expenses)
    # save predictions
    savePredictions(ids, predictions)
    # print(predictions)


main()
