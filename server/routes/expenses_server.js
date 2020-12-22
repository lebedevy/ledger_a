const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const knex = require('knex')(getKnexConfig());

const OPERATIONS = {
    between: 'between',
};

const EXPENSE_FIELDS = {
    expenses: {
        properties: {
            name: 'expenses',
            id: 'id',
            joins: { categories: 'category_id', stores: 'store_id' },
        },
        fields: {
            id: 'id',
            amount: 'amount',
            date: 'date',
            store_id: 'store_id',
            category_id: 'category_id',
        },
    },
    categories: {
        properties: { id: 'id', name: 'categories' },
        fields: { id: 'id', category_name: 'category_name' },
    },
    stores: {
        properties: { id: 'id', name: 'stores' },
        fields: { id: 'id', store_name: 'store_name' },
    },
};

// filter structure: {operation, field, value}
// column structure: {table, column}

const getExpenses = async (table, { where, columns, aggregate, groupBy }) => {
    const userFilter = where.find((filter) => filter.field === 'user_id');
    if (!userFilter || userFilter.field == null) throw new Error('User id cannot be empty');

    let query = knex(table);
    addWhere(query, where);

    if (aggregate && groupBy) {
        if (aggregate)
            aggregate.forEach(({ field, operation }) => {
                console.log(operation);
                switch (operation) {
                    case 'SUM':
                        query.sum(`${field} as ${field}`);
                        break;
                    case 'AVERAGE':
                        query.avg(`${field} as ${field}`);
                        break;
                    default:
                        throw new Error('Invalid aggregation operation');
                }
            });
        Object.entries(groupBy).forEach(([tableName, cols]) => {
            // if (table !== tableName) joinTable(query, table, tableName);

            // Group by alais if provided
            cols.forEach((col) => {
                if (Array.isArray(col)) {
                    query.select(col[0]);
                    query.groupBy(col[0]);
                } else {
                    query.select(`${tableName}.${col}`);
                    query.groupBy(`${tableName}.${col}`);
                }
            });
        });
        // addColumns(query, table, columns);
        query = knex({ expenses: query });
    }
    addColumns(query, table, columns);

    query.debug(true);

    return await query;
};

function addColumns(query, table, columns) {
    // Add columns and required joins
    if (columns) {
        Object.entries(columns).forEach(([tableName, cols]) => {
            if (tableName !== table) joinTable(query, table, tableName);

            // add columns to the select statement
            cols.forEach((col) => {
                if (Array.isArray(col)) query.select(knex.ref(`${tableName}.${col[0]}`).as(col[1]));
                else query.select(`${tableName}.${col}`);
            });
        });
    }
}

function joinTable(query, table, joinTable) {
    // add join
    query.leftJoin(
        joinTable,
        `${table}.${EXPENSE_FIELDS[table].properties.joins[joinTable]}`,
        `${joinTable}.${EXPENSE_FIELDS[joinTable].properties.id}`
    );
}

function addWhere(query, where) {
    where.forEach((filter) => {
        switch (filter.operation) {
            case OPERATIONS.between:
                query.whereBetween(filter.field, filter.value);
                break;
            default:
                query.where(filter.field, filter.value);
        }
    });
}

function getKnexConfig() {
    const connection = {
        host: config.host,
        user: config.username,
        password: config.password,
        database: config.database,
    };
    if (config.port) connection.port = config.port;

    return {
        asyncStackTraces: true,
        client: 'pg',
        connection,
    };
}

module.exports = {
    getExpenses,
    EXPENSE_FIELDS,
    OPERATIONS,
};
