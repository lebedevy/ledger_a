import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { IconButton } from '@material-ui/core';

import CategoryIcon from '@material-ui/icons/Category';
import StoreIcon from '@material-ui/icons/Store';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';

const useStyles = makeStyles({
    container: {
        height: '8vh',
        background: '#ffffff',
        position: 'fixed',
        bottom: 0,
        right: 0,
        left: 0,
        display: 'flex',
        justifyContent: 'space-around',
        '& svg': {
            // color: 'white',
        },
    },
});

export default function MobileNav({ history }) {
    const classes = useStyles();

    function navTo(path) {
        history.push(path);
    }

    return (
        <div className={classes.container}>
            <IconButton onClick={() => navTo('/users/expenses/overview')}>
                <MonetizationOnIcon fontSize="large" />
            </IconButton>
            <IconButton onClick={() => navTo('/users/expenses/overview/cat')}>
                <CategoryIcon fontSize="large" />
            </IconButton>
            <IconButton onClick={() => navTo('/users/expenses/overview/store')}>
                <StoreIcon fontSize="large" />
            </IconButton>
            <IconButton onClick={() => navTo('/users/app/settings')}>
                <SettingsApplicationsIcon fontSize="large" />
            </IconButton>
        </div>
    );
}
