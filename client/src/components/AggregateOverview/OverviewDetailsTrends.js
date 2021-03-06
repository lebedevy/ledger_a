import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { CircularProgress } from '@material-ui/core';
import { getFormatedDate } from '../../utility/utility';
import BarChartAggregate from './BarChartAggregate';
import { months } from '../../data/data';
import SummaryItem from '../SummaryItem';

function OverviewDetailsTrends({ selected, type, start, end }) {
    const [data, setData] = useState(null);
    const [max, setMax] = useState(null);
    const [startMonth, setStartMonth] = useState(null);
    const [endMonth, setEndMonth] = useState(null);

    useEffect(() => {
        if (selected) getData();
    }, [selected]);

    async function getData() {
        const currentDate = new Date(end);
        const [year, month] = [currentDate.getFullYear(), currentDate.getMonth()];
        // Get one year period
        const endDate = getFormatedDate(new Date(year, month + 1, 0));
        const startDate = getFormatedDate(new Date(year - 1, month + 1, 1));
        setStartMonth([months[parseInt(startDate.slice(5, 7)) - 1], startDate.slice(0, 4)]);
        setEndMonth([months[parseInt(endDate.slice(5, 7)) - 1], endDate.slice(0, 4)]);
        const res = await fetch(
            `/api/users/expenses/overview/${type}/trends` +
                `?start=${startDate}&end=${endDate}&id=${selected.el.id}`
        );
        if (res.ok) {
            const data = await res.json();
            const formatted = formatData(data.expenses, startDate);
            setData(formatted);
            return data;
        }
        return null;
    }

    function formatData(data, start) {
        let formatted = [];
        let max = 0;
        let startMonth = parseInt(start.slice(5, 7)) - 1;
        let year = parseInt(start.slice(0, 4));
        if (startMonth < 0) startMonth = 11;
        for (let i = 0, ind = 0; i < 12; i++) {
            let month = i + startMonth >= 12 ? i + startMonth - 12 : i + startMonth;
            let monthItem = {};
            monthItem.month = months[month];
            monthItem.year = (year % 100) + '';
            if (monthItem.month === 'Dec') year++;
            if (data[ind] && parseInt(data[ind]['txn_date'].slice(5, 7)) - 1 === month) {
                monthItem['amount'] = data[ind]['amount'];
                max = data[ind]['amount'] > max ? data[ind]['amount'] : max;
                ind++;
            } else {
                monthItem['amount'] = 0;
            }

            formatted.push(monthItem);
        }
        // Make sure 6 divides evenly into max to allow for round grid line labels on the barchart
        if (max % 6 !== 0) max += 6 - (max % 6);
        setMax(max);
        return formatted;
    }

    return (
        <SummaryItem>
            <h2>
                Trends Overview:
                <label>{`${selected.el[type === 'category' ? 'category' : 'store']}`}</label>
            </h2>
            {startMonth && endMonth && (
                <label>{`${startMonth[0]} ${startMonth[1]} to ${endMonth[0]} ${endMonth[1]}`}</label>
            )}
            <label>
                {`${
                    selected.el[type === 'category' ? 'category' : 'store']
                } spending overview over the last year`}
            </label>
            {data ? null : <CircularProgress style={{ alignSelf: 'center', margin: '10px' }} />}
            <BarChartAggregate max={max} data={data} />
        </SummaryItem>
    );
}

const mapStateToProps = (state) => {
    const { start, end } = state.date.period;
    const { mobile } = state.screen;
    return { start, end, mobile };
};

export default connect(mapStateToProps)(OverviewDetailsTrends);
