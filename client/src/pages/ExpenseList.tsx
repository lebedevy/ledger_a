import React, { useMemo, useState, useEffect } from 'react';
import { cx, css } from 'emotion';
import { useLocation, useHistory } from 'react-router-dom';
import { getSortIndexes, getSort } from '../utility/utility';
import { RootState } from '../components/typescript/general_interfaces';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import LoadingComponent from '../components/LoadingComponent';
import Summary from '../components/Summary';
import { Flexbox, CellButton } from '../components/styling/CommonStyles';
import { useGetData } from '../data/dataHooks';
import styled from '@emotion/styled';
import { css as css2 } from '@emotion/react';

const containerCss = css`
    margin: 0 auto;
    width: 100vw;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const desktopCss = css`
    height: calc(100vh - 130px);
`;

const options = ['Date', 'Amount', 'Store', 'Category'];
const optionsLower = options.map((el) => el.toLowerCase());
const orderDir = ['asc', 'desc'];

function useUrlSearch() {
    const location = useLocation();
    const [sort, order] = useMemo(() => getSortIndexes(optionsLower, ...getSort(location.search)), [
        location,
    ]);
    return [sort, order];
}

interface IParams {
    sort?: string;
    order?: string;
}

// interface IExp {
//     all: undefined | any[];
// }

export default function ExpenseList() {
    const location = useLocation();
    const history = useHistory();
    const getData = useGetData();
    const [sort, order] = useUrlSearch();
    const [openSort, setOpenSort] = useState(false);
    const [expenses, setExpenses] = useState<any>({ all: undefined });

    const { width, height, start, end, deleteIds, groupKey } = useSelector((state: RootState) => {
        return {
            ...state.screen,
            ...state.date.period,
            ...state.editing.deletingMode,
            ...state.appState,
        };
    });

    // Fetch expenses on change
    useEffect(() => {
        fetchExpenses();
    }, [start, end, sort, order, groupKey]);

    const updateURL = ({ sort, order }: { sort: any; order: any }) => {
        const search = new URLSearchParams();
        search.set('sort', optionsLower[sort].toLowerCase());
        search.set('order', order === 1 ? 'desc' : 'asc');
        let path = location.pathname;
        if (path.slice(-1) === '/') path = history.location.pathname.slice(0, -1);
        history.push(path + '?' + search.toString());
    };

    const updateSort = (sort: number) => {
        updateURL({ sort, order });
    };

    const updateOrder = (order: number) => {
        updateURL({ sort, order });
    };

    const fetchExpenses = async () => {};

    const deleteExpenses = async () => {
        // Make sure the correct expense is being deleted
        // call api to remove
        const res = await fetch(`/api/users/expenses/delete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(deleteIds),
        });

        if (res.ok) {
            fetchExpenses();
        } else {
            // Show error message
            const data = await res.json();
            console.error(data);
        }
    };

    const getExpData = async (key?: string, val?: string | number) => {
        console.info('Getting expenses');

        if (key != null && val != null && groupKey) {
            const data = await getData(false, { [key]: val });
            console.log(data);
            const exp = {
                ...expenses,
                [groupKey]: { ...expenses[groupKey], [val]: data },
            };
            setExpenses(exp);
        } else {
            const params: IParams = {};
            if (sort) params.sort = optionsLower[sort as any];
            if (order) params.order = orderDir[order as any];
            const data = await getData(true, params as any);
            setExpenses({ all: data.expenses ?? data });
        }
    };

    console.log(expenses);
    const total = expenses.all?.reduce((total: number, exp: any) => total + exp.amount, 0);

    return (
        <div
            className={cx(width > 600 && desktopCss, containerCss)}
            style={width <= 600 ? { height: `calc(${height}px - 16vh)` } : {}}
        >
            <Header
                deleteAllowed
                deleteExpenses={deleteExpenses}
                open={openSort}
                setOpen={() => setOpenSort(!openSort)}
                title="Expenses"
                dashboard={{
                    setSort: updateSort,
                    setOrder: updateOrder,
                    sort,
                    order,
                    options,
                }}
            />
            <Table groupKey={groupKey} getData={getExpData} data={expenses} />
            <Summary total={total} />
        </div>
    );
}

const Cell = styled.td`
    flex: 1;
    border: 1px solid #00000030;
`;

const HeaderCell = styled.td`
    flex: 1;
    border: 1px solid #00000030;
    border-bottom: 1px solid #000000;
    border-right: 1px solid #000000;
    font-weight: bold;
    background-color: lightgray;
`;

const WTable = styled.table`
    overflow-y: auto;
    overflow-x: hidden;
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    border-radius: 5px;
`;

function Table({
    groupKey,
    getData,
    data,
}: {
    getData: (groupKey?: string, groupVal?: string | number) => void;
    groupKey: string | undefined;
    data: any;
}) {
    const columns = {
        amount: { name: 'Amount', field: 'amount' },
        store: { name: 'Store', field: 'store' },
        category: { name: 'Category', field: 'category' },
        date: { name: 'Date', field: 'date' },
    };

    useEffect(() => {
        getData();
    }, [groupKey]);

    const colOrder = ['amount', 'store', 'category', 'date'];
    const fields = useMemo(() => {
        switch (groupKey) {
            case 'store':
                return [
                    columns.store,
                    ...colOrder
                        .filter((col) => col !== 'store')
                        .map((col) => columns[col as keyof typeof columns]),
                ];
            case 'category':
                return [
                    columns.category,
                    ...colOrder
                        .filter((col) => col !== 'category')
                        .map((col) => columns[col as keyof typeof columns]),
                ];
            default:
                return colOrder.map((col) => columns[col as keyof typeof columns]);
        }
    }, [groupKey]);

    // data structure:
    // all: the base layer of the data
    // key: { id: data }
    // Data for a grouped key
    // we can only group by a key once, so we can keep the list flat

    const getRows = (dataSet: any[], ind: number) => {
        console.log(dataSet, ind);
        const rows: any[] = [];
        dataSet.forEach((r, i) => {
            // for now use index to avoid going deeper than 1 lvl
            const opened = ind === 0 && groupKey && data[groupKey]?.[r[`${groupKey}_id`]];
            rows.push(
                <Row
                    key={r.id ?? i}
                    groupKey={ind === 0 ? groupKey : null}
                    getData={getData}
                    fields={fields}
                    el={r}
                    opened={opened}
                />
            );
            if (opened && groupKey)
                rows.push(getRows(data[groupKey][r[`${groupKey}_id`]], ind + 1));
        });
        return rows;
    };

    const rows = useMemo(() => data.all && getRows(data.all, 0), [data]);

    // console.log(data);

    return (
        <div style={{ overflow: 'auto' }}>
            <WTable>
                {data.all?.length === 0 && <label>No records</label>}
                <Flexbox as="tr">
                    {fields.map(({ name }) => (
                        <HeaderCell>{name}</HeaderCell>
                    ))}
                </Flexbox>
                {rows}
                {!data && <LoadingComponent />}
            </WTable>
        </div>
    );
}

function Row({ groupKey, getData, fields, el, opened }: any) {
    return (
        <Flexbox as="tr">
            {fields.map(({ field }: { field: string }) =>
                groupKey && groupKey === field ? (
                    <GroupCell
                        opened={opened}
                        getData={() => getData(`${groupKey}_id`, el[`${groupKey}_id`])}
                    >
                        {el[field] as any}
                    </GroupCell>
                ) : (
                    <Cell>{el[field]}</Cell>
                )
            )}
        </Flexbox>
    );
}

const cellBorder = css2`
    border: 1px solid #00000030;
    padding: 0;
`;

function GroupCell({
    children,
    getData,
    opened,
}: {
    getData: () => void;
    children: JSX.Element | JSX.Element[];
    opened: boolean;
}) {
    return (
        <Flexbox as="td" spaceBetween css={cellBorder}>
            {children}
            <CellButton onClick={getData}>
                <i className="material-icons">{opened ? 'expand_less' : 'expand_more'}</i>
            </CellButton>
        </Flexbox>
    );
}
