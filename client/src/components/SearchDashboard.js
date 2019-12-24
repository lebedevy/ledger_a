import React, { useState } from 'react';
import { connect } from 'react-redux';
import { TextField, Select } from '@material-ui/core';
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
});

function Dashboard({ start, end, setPeriod }) {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <div className={classes.option}>
                <label>Sort</label>
                <Select value={0}>
                    <option value={0}>Date</option>
                    <option value={1}>Amount</option>
                    <option value={2}>Store</option>
                    <option value={3}>Category</option>
                </Select>
                <Select value={0}>
                    <option value={0}>ASC</option>
                    <option value={1}>DESC</option>
                </Select>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { date } = state;
    const { start, end } = date.period;
    console.log(start, end);
    return { start, end };
};

export default connect(mapStateToProps, { setPeriod })(Dashboard);
