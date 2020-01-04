import React from 'react';
import { connect } from 'react-redux';
import DateRange from '../DateRange';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';
import { logout } from '../../redux/actions';

const useStyles = makeStyles({
    container: {
        padding: '0 10px',
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

function MobileSettings({ history, logout }) {
    const classes = useStyles();

    async function logoutUser() {
        logout();
        const res = await fetch('/api/users/logout', { method: 'POST' });
        if (res.status === 200) history.go('/users/login');
    }

    return (
        <div className={classes.container}>
            <div className={classes.item}>
                <h2>App Date Range</h2>
                <label>Select the date range for app data.</label>
                <label>Show expenses for period:</label>
                <DateRange />
            </div>
            <div className={classes.item}>
                <h2>Account Settings</h2>
                <Button onClick={logoutUser} variant="contained" color="primary">
                    Logout
                </Button>
            </div>
        </div>
    );
}

export default connect(null, { logout })(MobileSettings);
