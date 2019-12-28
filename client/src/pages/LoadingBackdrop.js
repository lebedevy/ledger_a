import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    backdrop: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        background: '#00000099',
        zIndex: 2,
    },
});

export default function LoadingBackdrop({ waitingRes }) {
    const classes = useStyles();
    return waitingRes ? (
        <div className={classes.backdrop}>
            <CircularProgress />
        </div>
    ) : null;
}
