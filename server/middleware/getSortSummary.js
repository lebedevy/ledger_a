function getSortSummary(req, _res, next) {
    const order = req.query.order === 'desc' ? 'desc' : 'asc';

    let column = 'date';
    switch (req.query.sort) {
        case 'category':
            column = 'category.category_name';
            break;
        case 'store':
            column = 'store.store_name';
            break;
        case 'amount':
            column = 'amount';
            break;
    }

    req.sortOption = `${column} ${order}`;
    return next();
}

module.exports = getSortSummary;
