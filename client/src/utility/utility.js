export function getFormatedDate(date) {
    return `${date.getFullYear()}-${(date.getMonth() < 9 ? '0' : '') +
        (date.getMonth() + 1)}-${(date.getDate() < 10 ? '0' : '') + date.getDate()}`;
}

export function getCurrencyFormat(number) {
    let num = Math.round(number * 100) / 100; // Round to 2
    let formatted = Number(num).toLocaleString(); // Add ',' seperators
    //   Ensure exactly two decimal places in number & return
    let temp = formatted.split('.');
    if (temp.length > 1) {
        let decimal = temp[1].slice(0, 2);
        if (decimal.length < 2) decimal += '0';
        return `${temp[0]}.${decimal}`;
    }
    return formatted + '.00';
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
