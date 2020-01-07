import React from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { setSettingsScreen } from '../../redux/actions';

import SettingsIcon from '@material-ui/icons/Settings';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

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
        background: '#00000020',
        borderBottom: '2px solid #000000',
        padding: 0,
    },

    selected: {
        background: '#ffffff',
        paddingBottom: '2px',
        borderBottom: 'none',
    },
});

function MobileSettingsNav({ settings, setSettingsScreen }) {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <div
                className={clsx(classes.option, settings === 0 && classes.selected)}
                onClick={() => setSettingsScreen(0)}
            >
                <SettingsIcon fontSize="large" />
            </div>
            <div
                className={clsx(classes.option, settings === 1 && classes.selected)}
                onClick={() => setSettingsScreen(1)}
            >
                <AccountCircleIcon fontSize="large" />
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { settings } = state.screenSelect;
    return { settings };
};

export default connect(mapStateToProps, { setSettingsScreen })(MobileSettingsNav);
