import React, { useState } from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { closeDrawer, logout } from '../redux/actions';
import { makeStyles } from '@material-ui/styles';
import { setPeriod } from '../redux/actions';
import DateSelectMonth from './date_select/DateSelectMonth';
import DateSelectDates from './date_select/DateSelectDates';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: '10px',
    },
    selectType: {},
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

function DateRange({ start, end, setPeriod }) {
    const classes = useStyles();
    const [selectType, setSelectType] = useState(0);

    return (
        <div className={classes.container}>
            <div>
                <label>Date select type:</label>
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

const mapStateToProps = state => {
    const { date } = state;
    const { start, end } = date.period;
    return { start, end };
};

const mapDispatchToProps = { closeDrawer, logout, setPeriod };

export default connect(mapStateToProps, mapDispatchToProps)(DateRange);
