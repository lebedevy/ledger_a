import React from 'react';
import { connect } from 'react-redux';
import DateRange from '../DateRange';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';
import { logout } from '../../redux/actions';

const useStyles = makeStyles({
    container: {
        padding: '0 10px',
        '& h1': {
            margin: 0,
            padding: '10px 0',
        },
        '& h2': {
            fontSize: '1.5em',
            margin: '10px 0',
            // padding: '10px 0',
        },
        '& label': {
            display: 'block',
            margin: '10px 0',
        },
    },
    item: {
        margin: '10px 0',
        padding: '10px',
        border: '1px solid #00000020',
    },
});

function AppSettings({ history, logout }) {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <h1>App Settings</h1>
            <div className={classes.item}>
                <h2>App Date Range</h2>
                <label>Select the date range for app data.</label>
                <label>Show expenses for period:</label>
                <DateRange />
            </div>
        </div>
    );
}

export default connect(null, { logout })(AppSettings);
