import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { IconButton } from '@material-ui/core';

import ListIcon from '@material-ui/icons/List';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
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
        // justifyContent: 'space-around',
        '& svg': {
            // color: 'white',
        },
    },
    option: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#00000005',
        paddingBottom: '2px',
        // borderBottom: '2px solid #00000020',
    },
    selected: {
        background: '#00000020',
        borderBottom: '2px solid #000000',
        margin: 0,
        padding: 0,
    },
});

const overviewLinks = ['', '/cat', '/store'];
const detailLinks = [''];

export default function MobileSubNav({ match, history, location }) {
    const classes = useStyles();
    const [type, setType] = useState(0);
    const [page, setPage] = useState(0);

    useEffect(() => {
        const loc = location.pathname.split('/');
        console.log(location);
        console.log(loc[3], loc[4]);
        setType(loc[3] === 'overview' ? 0 : 1);
        setPage(loc[4] != null ? (loc[4] === 'cat' ? 1 : 2) : 0);
    }, [location]);

    function navTo(path) {
        history.push(path);
    }

    return (
        <div className={classes.container}>
            <div
                className={clsx(classes.option, type === 0 && classes.selected)}
                onClick={() => navTo(`/users/expenses/overview${overviewLinks[page]}`)}
            >
                <DonutLargeIcon fontSize="large" />
            </div>
            <div
                className={clsx(classes.option, type === 1 && classes.selected)}
                onClick={() => navTo(`/users/expenses/summary${overviewLinks[page]}`)}
            >
                <ListIcon fontSize="large" />
            </div>
        </div>
    );
}
