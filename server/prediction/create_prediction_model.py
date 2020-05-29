from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import SGDClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
import json
import psycopg2
import numpy
import random
import pickle
import sys

CLASS_SIZE = 10

ENV = 'development'
USER_ID = sys.argv[1]
print('#node:Python Started', ENV, USER_ID)


# db methods
def connect(env='development'):
    with open('config/config.json') as file:
        data = file.read()
    conn = json.loads(data)[env]
    conn_string = f"host='{conn['host']}' dbname='{conn['database']}' user='{conn['username']}' password='{conn['password']}'"
    connection = psycopg2.connect(conn_string)
    return connection


def getExpenses():
    connection = connect()
    with connection.cursor() as curs:
        curs.execute(
            'SELECT amount, date, store_id, COALESCE(category_id, -1) FROM expenses WHERE user_id = %s ORDER BY category_id;', [USER_ID])
        expenses = curs.fetchall()
    return expenses


def save_model(model):
    connection = connect()
    with connection.cursor() as curs:
        curs.execute(
            'INSERT INTO category_classifier (user_id, model, "createdAt", "updatedAt") VALUES (%s, %s, now(), now());', (str(USER_ID), psycopg2.Binary(model)))
    connection.commit()


def formatExpenses(expenses):
    result = []
    categories = []
    for expense in expenses:
        # Date not currently used
        # expense[1],
        result.append([expense[0], -1 if expense[2] == None else expense[2]])
        categories.append(-1 if expense[3] == None else expense[3])
    return (result, categories)


def add(prop, obj):
    try:
        obj[prop] += 1
    except:
        obj[prop] = 1


def printResults(result):
    tCount = {}
    catCount = {}

    i = 0
    correct = 0
    for r in result:
        print(r, categories[i])
        if(r == categories[i]):
            correct += 1
        add(r, tCount)
        add(categories[i], catCount)
        i += 1

    print('Overall: ', correct / len(categories))

    # print('Test Counts')
    # printCount(tCount)
    print('Actual Counts')
    printCount(catCount, tCount)


def printCount(count, tCount):
    # Print distribution of prediciton vs actual distribution
    for c in count:
        print(c, ': ', count[c], tCount[c] if c in tCount else 0)


def sample(expenses):
    groups = {}
    # group expenses by category
    for exp in expenses:
        try:
            groups[exp[3]].append(exp)
        except:
            groups[exp[3]] = [exp]
    # over and undersample as required
    final = []
    for g in groups:
        if(len(groups[g]) < CLASS_SIZE):
            while(len(groups[g]) < CLASS_SIZE):
                groups[g] = groups[g] + groups[g].copy()
        # if(len(groups[g]) > CLASS_SIZE):
        #     groups[g] = groups[g][0:10]
        final = final + groups[g]
    return final


def printAll(arr):
    for a in arr:
        print(a)


def r():
    return 0.5


def getSGDCLassifier(l):
    SGDClassifier(n_iter_no_change=1000000/l)

#
# BODY START
#


# expenses = sample(getExpenses())
expenses = getExpenses()

random.shuffle(expenses, r)

# printAll(expenses)

(expenses, categories) = formatExpenses(expenses)

clf = make_pipeline(
    # StandardScaler(),
    # getSGDCLassifier(len(expenses))
    RandomForestClassifier()
)

clf.fit(expenses, categories)

save_model(pickle.dumps(clf))

print('clf Score: ', clf.score(expenses, categories))
# dec = clf.decision_function([expenses[0]])
# print(dec)
test = clf.predict(expenses)

# printResults(test)

print(clf.predict([expenses[0]]))
print('Actual: ', categories[0])

print(clf.predict([[12, 76]]))
print(clf.predict_proba([[12, 76]]))

# unqiue = {}
# for cat in categories:
#     unqiue[cat] = 1

# print(unqiue.keys())
