import React from 'react';
import { makeStyles } from '@material-ui/styles';

import CategoryIcon from '@material-ui/icons/Category';
import StoreIcon from '@material-ui/icons/Store';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import { IconButton } from '@material-ui/core';

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

export default function MobileNav() {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <IconButton href="/users/expenses/overview">
                <MonetizationOnIcon fontSize="large" />
            </IconButton>
            <IconButton href="/users/expenses/overview/cat">
                <CategoryIcon fontSize="large" />
            </IconButton>
            <IconButton href="/users/expenses/overview/store">
                <StoreIcon fontSize="large" />
            </IconButton>
        </div>
    );
}
