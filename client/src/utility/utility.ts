export function getFormatedDate(date: Date) {
    return `${date.getFullYear()}-${(date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1)}-${
        (date.getDate() < 10 ? '0' : '') + date.getDate()
    }`;
}

export function getDateObj(date: string) {
    const [year, month, day] = date.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

export function compareDates(date1: Date, date2: Date) {
    // Check if date 2 is larger than date 1
    if (date1.getUTCFullYear() < date2.getUTCFullYear()) return 1;
    if (date1.getUTCMonth() < date2.getUTCMonth()) return 1;
    if (date1.getUTCDate() < date2.getUTCDate()) return 1;
    return 0;
}

export function getCurrencyFormat(number: number) {
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

export function getSort(URLSearch: string) {
    const search = new URLSearchParams(URLSearch);
    return [search.get('sort'), search.get('order')];
}

export function getSortIndexes(options: Array<string>, sort?: any, order?: any) {
    let orderInd = null,
        sortInd = null;
    if (order) {
        order = order.toLowerCase();
        orderInd = order === 'asc' ? 0 : order === 'desc' ? 1 : null;
    }
    if (sort) {
        sort = sort.toLowerCase();
        let temp = options.indexOf(sort);
        sortInd = temp !== -1 ? temp : null;
    }

    return [sortInd, orderInd];
}

export function getOptions(predictions: Array<number>, classes: Array<string>) {
    const options = predictions.map((p, ind) => [p, classes[ind]]);
    return options.sort((a, b) => (b[0] as number) - (a[0] as number));
}
