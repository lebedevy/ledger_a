import React from 'react';
import { connect } from 'react-redux';
import { TextField, Select, MenuItem, FormControl } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { setPeriod } from '../redux/actions';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        margin: '10px',
        '& label': {
            margin: '0 10px 0 5px',
            fontWeight: 'bold',
        },
        '& input': {
            // width: '130px',
        },
    },
    option: {
        display: 'flex',
        alignItems: 'center',
    },
    type: {
        minWidth: '90px',
    },
    order: {
        minWidth: '70px',
    },
    item: {
        cursor: 'pointer',
        padding: '10px',
    },
});

function Dashboard({ setSort, setOrder, sort, order, options }) {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <div className={classes.option}>
                <label>Sort</label>
                <Select
                    className={classes.type}
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                >
                    {options.map((el, ind) => (
                        <MenuItem key={el} className={classes.item} value={ind}>
                            {el}
                        </MenuItem>
                    ))}
                </Select>
                <Select
                    className={classes.order}
                    value={order}
                    onChange={e => setOrder(e.target.value)}
                >
                    <MenuItem value={0}>ASC</MenuItem>
                    <MenuItem value={1}>DESC</MenuItem>
                </Select>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { date } = state;
    const { start, end } = date.period;
    return { start, end };
};

export default connect(mapStateToProps, { setPeriod })(Dashboard);
