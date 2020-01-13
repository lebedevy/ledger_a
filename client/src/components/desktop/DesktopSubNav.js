import React, { useEffect } from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { setScreen } from '../../redux/actions';

import ListIcon from '@material-ui/icons/List';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';

const useStyles = makeStyles({
    container: {
        background: '#ffffff',
        position: 'fixed',
        top: '65px',
        right: 0,
        left: 0,
        display: 'flex',
        justifyContent: 'center',
        '& svg': {
            // color: 'white',
        },
    },
    bar: {
        display: 'flex',
        width: '100%',
        maxWidth: '1200px',
        height: '65px',
    },
    option: {
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#00000020',
        borderRight: '1px solid #00000020',
        borderLeft: '1px solid #00000020',
        borderBottom: '2px solid #000000',
        cursor: 'pointer',
        padding: 0,
        '&:hover': {
            background: '#E7E5E8',
        },
    },

    selected: {
        background: '#ffffff',
        paddingBottom: '2px',
        borderBottom: 'none',
        '&:hover': {
            background: '#ffffff',
        },
    },
});

function MobileSubNav({ screen, setScreen, history, location }) {
    const classes = useStyles();

    useEffect(() => {
        changeScreen(screen);
    }, []);

    const changeScreen = option => {
        if (option !== screen) {
            let path = location.pathname;
            console.log(path);
            path = path.replace(
                screen === 0 ? 'overview' : 'summary',
                option === 0 ? 'overview' : 'summary'
            );
            console.log(path);
            history.push(path);
            // set the right screen for mobile
            setScreen(option);
        }
    };

    return (
        <div className={clsx(classes.container)}>
            <div className={classes.bar}>
                <div
                    className={clsx(classes.option, screen === 0 && classes.selected)}
                    onClick={() => changeScreen(0)}
                >
                    <DonutLargeIcon fontSize="large" />
                    Overview
                </div>
                <div
                    className={clsx(classes.option, screen === 1 && classes.selected)}
                    onClick={() => changeScreen(1)}
                >
                    <ListIcon fontSize="large" />
                    Details
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { screen } = state.screenSelect;
    const { mobile } = state.screen;
    console.log(state);
    return { screen, mobile };
};

export default connect(mapStateToProps, { setScreen })(MobileSubNav);
