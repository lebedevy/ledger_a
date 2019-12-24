function getSortSummary(req, res, next) {
    console.log(req.query);
    console.log(req.params);
    // ('amount DESC');

    let order = 'asc';
    switch (req.query.order) {
        case 'desc':
            order = 'desc';
            break;
    }

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
    console.log(req.sortOption);
    return next();
}

module.exports = getSortSummary;
