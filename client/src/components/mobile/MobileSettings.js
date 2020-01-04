import React from 'react';
import DateRange from '../DateRange';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    container: {
        padding: '10px',
        '& h1': {
            fontSize: '2em',
            margin: '10px 0',
            padding: '10px 0',
        },
        '& label': {
            display: 'block',
        },
    },
});

export default function MobileSettings() {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <h1>App Date Range</h1>
            <label>Select the date range for app data.</label>
            <label>Show expenses for:</label>
            <DateRange />
        </div>
    );
}
