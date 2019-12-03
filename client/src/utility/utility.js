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
