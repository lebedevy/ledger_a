function cleanInput(req, res, next) {
    console.info('Validating input...');
    try {
        if (req.body.expense) {
            let { amount, date, store, category } = req.body.expense;
            if (!isNaN(amount)) {
                console.log(amount, store, category, date);
                [store, category] = [store, category].map((el) => el.trim());
                store = store === '' ? null : store;
                category = category === '' ? null : category;
                console.log(amount, store, category, date);
                req.expense = { amount, store, category, date };
                return next();
            }
        }
        return res.status(400).send({ message: 'Please verify your inputs.' });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: 'There was an error processing your request.' });
    }
}

module.exports = cleanInput;
