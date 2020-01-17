import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { connect } from 'react-redux';
import { CircularProgress } from '@material-ui/core';
import { getFormatedDate } from '../../utility/utility';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
    svg: {
        alignSelf: 'center',
        width: '80vw',
        maxWidth: '800px',
        maxHeight: '200px',
        // transform: 'rotate(-0.25turn)',
        // background: 'yellow',
        border: '1px solid #000000',
    },
});

let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

function OverviewDetailsTrends({ selected, type, start, end }) {
    const classes = useStyles();
    const [data, setData] = useState(null);
    const [max, setMax] = useState(null);

    useEffect(() => {
        if (selected) getData();
    }, [selected]);

    async function getData() {
        // console.log(selected);
        console.log(start);
        const currentDate = new Date(end);
        const [year, month] = [currentDate.getFullYear(), currentDate.getMonth()];
        // Get one year period
        const endDate = getFormatedDate(new Date(year, month + 1, 0));
        const startDate = getFormatedDate(new Date(year - 1, month + 1, 1));
        console.log(startDate, start);
        console.log(endDate, end);
        const res = await fetch(
            `/api/users/expenses/overview/${type}/trends?start=${startDate}&end=${endDate}&id=${selected.el.id}`
        );
        console.log(res);
        if (res.ok) {
            const data = await res.json();
            console.log(data);
            console.log(endDate.slice(5, 7));
            const formatted = formatData(data.expenses, parseInt(endDate.slice(5, 7)) - 1);
            setData(formatted);
            return data;
        }
        return null;
    }

    function formatData(data, start) {
        let formatted = [];
        let max = 0;
        if (start < 0) start = 11;
        console.log(start);
        for (let i = 0, ind = 0; i < 12; i++) {
            let month = i + start >= 12 ? i + start - 12 : i + start;
            let monthItem = {};
            // console.log(months[month]);
            if (data[ind] && parseInt(data[ind]['txn_date'].slice(5, 7)) - 1 === month) {
                monthItem['amount'] = data[ind]['amount'];
                max = data[ind]['amount'] > max ? data[ind]['amount'] : max;
                ind++;
            } else {
                monthItem['amount'] = 0;
            }
            monthItem.month = months[month];
            formatted.push(monthItem);
        }
        setMax(max);
        return formatted;
    }

    return (
        <div className={classes.container}>
            <h3>
                Trends Overview:
                <label>{`${selected.el[type === 'cat' ? 'category_name' : 'store_name']}`}</label>
            </h3>
            {data ? null : <CircularProgress style={{ alignSelf: 'center', margin: '10px' }} />}
            <svg className={classes.svg}>
                {data
                    ? data.map((el, ind) => (
                          <React.Fragment>
                              <rect
                                  key={el.month + 'bar'}
                                  x={`${2 + 8 * ind}%`}
                                  y={`${90 - 80 * (el.amount / max)}%`}
                                  width={'6%'}
                                  height={`${80 * (el.amount / max)}%`}
                                  style={{ fill: '#00000090' }}
                              />
                              <text key={el.month + 'label'} x={`${2 + 8 * ind}%`} y={`${100}%`}>
                                  {el.month}
                              </text>
                          </React.Fragment>
                      ))
                    : null}
            </svg>
        </div>
    );
}

const mapStateToProps = state => {
    const { start, end } = state.date.period;
    return { start, end };
};

export default connect(mapStateToProps)(OverviewDetailsTrends);
