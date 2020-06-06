import numpy


def format_expense(expense, store_vectorizer):
    # 0: amount, 1: date, 2:store
    return numpy.concatenate(([expense[0]], store_vectorizer.transform(
        ['' if expense[2] == None else expense[2]]).toarray()[0]))
