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

    useEffect(() => {
        if (selected) getData();
    }, [selected]);

    async function getData() {
        // console.log(selected);
        console.log(start);
        const currentDate = new Date(end);
        const endDate = getFormatedDate(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
        );
        const startDate = getFormatedDate(
            new Date(currentDate.getFullYear() - 1, currentDate.getMonth() + 1, 1)
        );
        console.log(startDate, start);
        console.log(endDate, end);
        // getFormatedDate(new Date(year, month, 1)),
        // getFormatedDate(new Date(year, month + 1, 0)),
        const res = await fetch(
            `/api/users/expenses/overview/${type}/trends?start=${startDate}&end=${endDate}&id=${selected.el.id}`
        );
        console.log(res);
        if (res.ok) {
            const data = await res.json();
            console.log(data);
            setData(data);
        }
    }

    return (
        <div className={classes.container}>
            <h3>
                Trends Overview:
                <label>{`${selected.el[type === 'cat' ? 'category_name' : 'store_name']}`}</label>
            </h3>
            {data ? null : <CircularProgress style={{ alignSelf: 'center', margin: '10px' }} />}
            <svg className={classes.svg}>
                {months.map((month, ind) => (
                    <React.Fragment>
                        <rect
                            key={month + 'bar'}
                            x={`${2 + 8 * ind}%`}
                            y={`${90}%`}
                            width={'6%'}
                            height={'100%'}
                            style={{ fill: '#00000020' }}
                        />
                        <text key={month + 'label'} x={`${2 + 8 * ind}%`} y={`${100}%`}>
                            {month}
                        </text>
                    </React.Fragment>
                ))}
            </svg>
        </div>
    );
}

const mapStateToProps = state => {
    const { start, end } = state.date.period;
    return { start, end };
};

export default connect(mapStateToProps)(OverviewDetailsTrends);
