function getSortAggregate(req, res, next) {
    console.log(req.query);
    console.log(req.params);

    let order = 'desc';
    switch (req.query.order) {
        case 'asc':
            order = 'asc';
            break;
    }

    let column = 'amount';
    if (req.query.sort === 'name') {
        switch (req.params.type) {
            case 'store':
                column = 'store_name';
                break;
            case 'category':
                column = 'category_name';
                break;
        }
    }

    req.sortOption = `${column} ${order}`;
    console.log(req.sortOption);
    return next();
}

module.exports = getSortAggregate;
