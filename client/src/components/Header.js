import React, { useState } from 'react';
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
        // flexDirection: 'column',
        justifyContent: 'space-between',
        margin: '0 10px',
    },
});

export default function Header({ title }) {
    const [dashboard, setDashboard] = useState(false);
    // const [start, setStart] = useState('');
    // const [end, setEnd] = useState('');

    const classes = useStyles();
    return (
        <div className={classes.headerContainer}>
            <div className={classes.header}>
                <h2>{title}</h2>
                <IconButton onClick={() => setDashboard(!dashboard)}>
                    <SortIcon className={classes.icon} />
                </IconButton>
            </div>
            {dashboard ? (
                <Dashboard
                // updateStart={val => this.updateDate('start', val)}
                // updateEnd={val => this.updateDate('end', val)}
                />
            ) : null}
        </div>
    );
}
