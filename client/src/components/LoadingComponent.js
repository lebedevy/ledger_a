import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';

const luseStyles = makeStyles({
    container: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        // alignItems: 'center',
    },
});

export default function LoadingComponent() {
    const classes = luseStyles();
    return (
        <div className={classes.container}>
            <CircularProgress />
        </div>
    );
}
