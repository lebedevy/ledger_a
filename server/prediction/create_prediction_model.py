from sklearn.feature_extraction.text import CountVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import SGDClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
from scipy.sparse import csr_matrix
import psycopg2
import numpy
import random
import pickle
import sys
import db_manager
import prediction_utility

CLASS_SIZE = 10

ENV = sys.argv[1]
USER_ID = sys.argv[2]
print('#node:Python Started', ENV, USER_ID)


# region Database methods
def getExpenses():
    connection = db_manager.connect(ENV)
    with connection.cursor() as curs:
        curs.execute(
            'SELECT amount, date, stores.store_name, COALESCE(category_id, -1) ' +
            'FROM expenses LEFT JOIN stores on stores.id = store_id' +
            ' WHERE user_id = %s ORDER BY category_id;', [USER_ID])
        expenses = curs.fetchall()
    return expenses


def save_model(model, exp_count):
    connection = db_manager.connect(ENV)
    with connection.cursor() as curs:
        curs.execute(
            'INSERT INTO category_classifier (user_id, model, expense_count, "createdAt", "updatedAt") ' +
            'VALUES (%s, %s, %s, now(), now()) ON CONFLICT (user_id) DO UPDATE SET model = EXCLUDED.model, "updatedAt" = now(), expense_count = EXCLUDED.expense_count;',
            (str(USER_ID), psycopg2.Binary(model), str(exp_count)))
    connection.commit()
# endregion


def formatExpenses(expenses, store_vectorizer):
    result = []
    categories = []
    for expense in expenses:
        result.append(prediction_utility.format_expense(
            expense, store_vectorizer))
        categories.append(-1 if expense[3] == None else expense[3])
    return (result, categories)


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


# region: Helpers
def printAll(arr):
    for a in arr:
        print(a)


def r():
    return 0.5


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
# endregion


def getSGDCLassifier(l):
    SGDClassifier(n_iter_no_change=1000000/l)


def main():
    print('Started')
    store_vectorizer = build_vectorizer(getLetterCombinations())
    # print(store_vectorizer.transform(['abaa']).toarray())
    expenses = getExpenses()
    random.shuffle(expenses, r)
    (formatted, categories) = formatExpenses(expenses, store_vectorizer)
    clf = make_pipeline(
        # StandardScaler(),
        # getSGDCLassifier(len(expenses))
        RandomForestClassifier()
    )
    clf.fit(formatted, categories)

    print('clf Score: ', clf.score(formatted, categories))

    save_model(pickle.dumps(clf), len(expenses))


main()
