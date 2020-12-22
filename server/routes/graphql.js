const { buildSchema } = require('graphql');
const { getExpenses, OPERATIONS, EXPENSE_FIELDS } = require('./expenses_server');

const {
    parseResolveInfo,
    simplifyParsedResolveInfoFragmentWithType,
} = require('graphql-parse-resolve-info');

// model definition
const {
    expenses: { properties: eProperties, fields: eFields },
    categories: { properties: cProperties, fields: cFields },
    stores: { properties: sProperties, fields: sFields },
} = EXPENSE_FIELDS;

const schema = buildSchema(`
    type Query {
        expenses(start: String!, end: String!, category_id: Int): [Expense]
        expenses_grouped(start: String!, end: String!, category: String, store: String): [GroupedExpense]
    }

    type Expense {
        amount: Float!
        category: String
        store: String
        date: String
        category_id(id: Int): Int
        store_id(id: Int): Int
    }

    type GroupedExpense {
        amount(operation: Operation!): Float!
        category_id: Int
        category: String
        store_id: Int
        store: String
    }

    enum Operation {
        SUM
        AVERAGE
    }
`);

// (groupBy: Boolean!)

const root = {
    expenses: async (args, req, context, info) => {
        // console.log(obj);
        // console.log(req);
        // console.log(context /*.fieldNodes*/);
        // console.log(info);

        const {
            fieldsByTypeName: { Expense },
        } = parseResolveInfo(context);
        // const { fields } = simplifyParsedResolveInfoFragmentWithType(
        //     parsedResolveInfoFragment,
        //     ComplexType
        // );
        console.log(Expense);
        console.log(args);

        const fields = {};
        const expenseFields = [];

        if (Expense.id) expenseFields.push(eFields.id);
        if (Expense.amount) expenseFields.push(eFields.amount);
        if (Expense.date) expenseFields.push(eFields.date);

        if (expenseFields.length > 0) fields.expenses = expenseFields;

        if (Expense.category) fields.categories = [[cFields.category_name, 'category']];
        if (Expense.category_id) {
            const category_id = [cFields.id, 'category_id'];
            fields.categories
                ? fields.categories.push(category_id)
                : (fields.categories = [category_id]);
        }

        if (Expense.store) fields.stores = [[sFields.store_name, 'store']];
        if (Expense.store_id) {
            const store_id = [sFields.id, 'store_id'];
            fields.stores ? fields.stores.push(store_id) : (fields.stores = [store_id]);
        }

        console.log(fields);

        const arguments = { ...args };
        if (Expense.store_id != null && Expense.store_id.args.id != null)
            arguments.store_id = Expense.store_id.args.id;
        if (Expense.category_id != null && Expense.category_id.args.id != null)
            arguments.category_id = Expense.category_id.args.id;

        const expenses = await getExpenses(eProperties.name, {
            where: getWhere(arguments, req),
            columns: fields,
        });

        return expenses;
    },

    expenses_grouped: async (args, req, context, info) => {
        const {
            fieldsByTypeName: { GroupedExpense },
        } = parseResolveInfo(context);

        console.log(args);
        console.log(GroupedExpense);

        const columns = {};
        const groupBy = {};
        if (GroupedExpense.category || GroupedExpense.category_id) {
            columns.categories = [
                [cFields.category_name, 'category'],
                [cFields.id, 'category_id'],
            ];
            groupBy.expenses = [eProperties.joins.categories];
        }
        if (GroupedExpense.store || GroupedExpense.store_id) {
            columns.stores = [
                [sFields.store_name, 'store'],
                [sFields.id, 'store_id'],
            ];
            groupBy.expenses = [eProperties.joins.stores];
        }

        const aggregate = [
            { field: eFields.amount, operation: GroupedExpense.amount.args.operation },
        ];
        columns.expenses = [eFields.amount];

        const expenses = await getExpenses(eProperties.name, {
            where: getWhere(args, req),
            columns,
            aggregate,
            groupBy,
        });

        console.log(expenses);

        return expenses;
    },
};

function getWhere(args, req) {
    const where = [
        { field: 'user_id', value: req.user.id },
        {
            operation: OPERATIONS.between,
            field: 'date',
            value: [args.start, args.end],
        },
    ];

    if (args.store_id)
        where.push({ field: `${sProperties.name}.${sProperties.id}`, value: args.store_id });

    if (args.category_id)
        where.push({ field: `${cProperties.name}.${cProperties.id}`, value: args.category_id });

    return where;
}

module.exports = {
    schema,
    root,
};
