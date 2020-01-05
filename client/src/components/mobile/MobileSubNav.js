import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { setScreen, setSettingsScreen } from '../../redux/actions';

import ListIcon from '@material-ui/icons/List';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';

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

function MobileSubNav({ screen, setScreen, setSettingsScreen }) {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <div
                className={clsx(classes.option, screen === 0 && classes.selected)}
                onClick={() => setScreen(0)}
            >
                <DonutLargeIcon fontSize="large" />
            </div>
            <div
                className={clsx(classes.option, screen === 1 && classes.selected)}
                onClick={() => setScreen(1)}
            >
                <ListIcon fontSize="large" />
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { screen } = state.screenSelect;
    return { screen };
};

export default connect(mapStateToProps, { setScreen, setSettingsScreen })(MobileSubNav);
