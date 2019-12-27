import React from 'react';
import { connect } from 'react-redux';
import { TextField } from '@material-ui/core';
import { closeDrawer, logout } from '../redux/actions';
import { makeStyles } from '@material-ui/styles';
import { setPeriod } from '../redux/actions';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        margin: '10px',
        '& label': {
            margin: '0 10px 0 5px',
            fontWeight: 'bold',
        },
        '& input': {
            // width: '130px',
        },
    },
    option: {
        display: 'flex',
        alignItems: 'center',
    },
    item: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});

function DateRange({ start, end, setPeriod }) {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <div className={classes.item}>
                <label>From</label>
                <TextField
                    type="date"
                    value={start}
                    variant="outlined"
                    margin="dense"
                    onChange={e => setPeriod({ start: e.target.value, end })}
                />
            </div>
            <div className={classes.item}>
                <label>To</label>
                <TextField
                    type="date"
                    margin="dense"
                    variant="outlined"
                    value={end}
                    onChange={e => setPeriod({ end: e.target.value, start })}
                />
            </div>
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
