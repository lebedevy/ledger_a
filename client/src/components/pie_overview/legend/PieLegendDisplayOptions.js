import React from 'react';
import { Switch } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { connect } from 'react-redux';

const useStyles = makeStyles({
    displayOption: {
        display: 'flex',
        alignItems: 'center',
        margin: '5px 10px',
        '& label': {
            fontWeight: 'bold',
        },
    },
    mobile: {
        color: 'white',
        justifyContent: 'center',
        margin: 0,
    },
});

function PieLegendDisplayOptions({ totals, setTotals, mobile }) {
    const classes = useStyles();
    console.log(mobile);
    return (
        <div className={clsx(classes.displayOption, mobile && classes.mobile)}>
            <label>%</label>
            <Switch onChange={() => setTotals(!totals)} checked={totals} />
            <label>$</label>
        </div>
    );
}

const mapStateToProps = state => {
    const { mobile } = state.screen;
    console.log();
    return { mobile };
};

export default connect(mapStateToProps)(PieLegendDisplayOptions);
