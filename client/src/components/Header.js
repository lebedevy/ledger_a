import React from 'react';
import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Dashboard from './SearchDashboard';
import SortIcon from '@material-ui/icons/Sort';

const useStyles = makeStyles({
    headerContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: '0 10px',
    },
});

export default function Header({ setOpen, open, title, dashboard }) {
    const classes = useStyles();
    return (
        <div className={classes.headerContainer}>
            <div className={classes.header}>
                <h2>{title}</h2>
                <IconButton onClick={setOpen}>
                    <SortIcon className={classes.icon} />
                </IconButton>
            </div>
            {open ? <Dashboard {...dashboard} /> : null}
        </div>
    );
}
