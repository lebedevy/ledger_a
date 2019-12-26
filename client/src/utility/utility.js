export function getFormatedDate(date) {
    return `${date.getFullYear()}-${(date.getMonth() < 9 ? '0' : '') +
        (date.getMonth() + 1)}-${(date.getDate() < 10 ? '0' : '') + date.getDate()}`;
}

export function getCurrencyFormat(number) {
    return `${new Intl.NumberFormat({
        style: 'currency',
        currency: 'USD',
    }).format(Number(number).toFixed(2))}`;
}

export function getSort(URLSearch) {
    const search = new URLSearchParams(URLSearch);
    return [search.get('sort'), search.get('order')];
}

export function getSortIndexes(options, sort, order) {
    let orderInd = null,
        sortInd = null;
    if (order) {
        order = order.toLowerCase();
        orderInd = order === 'asc' ? 0 : (order = 'desc' ? 1 : null);
    }
    if (sort) {
        sort = sort.toLowerCase();
        let temp = options.indexOf(sort);
        sortInd = temp !== -1 ? temp : null;
    }

    return [sortInd, orderInd];
}
