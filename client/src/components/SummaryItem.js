import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    summaryItem: {
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #00000020',
        padding: '10px',
        margin: '10px 0',
        '& label': {
            padding: '5px 0',
        },
        '& h2': {
            padding: '5px 0',
            margin: 0,
        },
    },
});

export default function SummaryItem({ children }) {
    const classes = useStyles();
    return <div className={classes.summaryItem}>{children}</div>;
}
