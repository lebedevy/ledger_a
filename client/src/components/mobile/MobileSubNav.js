import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { IconButton } from '@material-ui/core';

import ListIcon from '@material-ui/icons/List';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import clsx from 'clsx';

const useStyles = makeStyles({
    container: {
        height: '8vh',
        background: '#ffffff',
        position: 'fixed',
        top: 0,
        right: 0,
        left: 0,
        display: 'flex',
        justifyContent: 'space-around',
        '& svg': {
            // color: 'white',
        },
    },
    selected: {
        background: '#00000020',
    },
});

const overviewLinks = ['', '/cat', '/store'];
const detailLinks = [''];

export default function MobileSubNav({ match, history, location }) {
    const classes = useStyles();
    const [type, setType] = useState(0);
    const [page, setPage] = useState(0);
    console.log(match);
    console.log(history);
    console.log(location.pathname.split('/'));

    useEffect(() => {
        const loc = location.pathname.split('/');
        setType(loc[3] === 'overview' ? 0 : 1);
        setPage(loc[4] != null ? (loc[4] === 'cat' ? 1 : 2) : 0);
    }, [location]);

    return (
        <div className={classes.container}>
            <div className={clsx(type === 0 && classes.selected)}>
                <IconButton href={`/users/expenses/overview${overviewLinks[page]}`}>
                    <DonutLargeIcon fontSize="large" />
                </IconButton>
            </div>
            <div className={clsx(type === 1 && classes.selected)}>
                <IconButton href={`/users/expenses/summary/${overviewLinks[page]}`}>
                    <ListIcon fontSize="large" />
                </IconButton>
            </div>
            <IconButton>
                <SettingsApplicationsIcon fontSize="large" />
            </IconButton>
        </div>
    );
}
