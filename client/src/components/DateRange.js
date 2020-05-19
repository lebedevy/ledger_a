import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import DateSelectMonth from './date_select/DateSelectMonth';
import DateSelectDates from './date_select/DateSelectDates';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: '10px',
    },
    selectTypeCont: {
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        marginBottom: '10px',
    },
    selectType: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
    },
    button: {
        padding: '5px',
        width: '100px',
        border: '1px solid #00000030',
        background: 'lightgray',
        cursor: 'pointer',
    },
    selected: {
        background: 'orange',
    },
});

export default function DateRange() {
    const classes = useStyles();
    const [selectType, setSelectType] = useState(0);

    return (
        <div className={classes.container}>
            <div className={classes.selectTypeCont}>
                <label>Select type:</label>
                <div className={classes.selectType}>
                    <button
                        className={clsx(classes.button, selectType === 0 && classes.selected)}
                        onClick={() => setSelectType(0)}
                    >
                        Month
                    </button>
                    <button
                        className={clsx(classes.button, selectType === 1 && classes.selected)}
                        onClick={() => setSelectType(1)}
                    >
                        Dates
                    </button>
                </div>
            </div>
            {selectType ? <DateSelectDates /> : <DateSelectMonth />}
        </div>
    );
}
