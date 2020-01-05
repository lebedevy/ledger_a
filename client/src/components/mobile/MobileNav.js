import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { IconButton } from '@material-ui/core';

import CategoryIcon from '@material-ui/icons/Category';
import StoreIcon from '@material-ui/icons/Store';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import { connect } from 'react-redux';

const useStyles = makeStyles({
    container: {
        height: '8vh',
        background: '#ffffff',
        position: 'fixed',
        bottom: 0,
        right: 0,
        left: 0,
        display: 'flex',
        justifyContent: 'space-around',
        '& svg': {
            // color: 'white',
        },
    },
});

function MobileNav({ location, history, screen, settings }) {
    const classes = useStyles();
    const [baseLink, setBaseLink] = useState('/users/expenses/overview/');
    function navTo(path) {
        history.push(path);
    }

    useEffect(() => {
        setBaseLink(`/users/expenses/${screen === 0 ? 'overview' : 'summary'}`);
        let path = location.pathname;
        if (path.slice(-1) === '/') path = path.slice(0, -1);
        const els = path.split('/');
        history.push(
            `/users/expenses/${screen === 0 ? 'overview' : 'summary'}/${els[els.length - 1]}`
        );
    }, [screen]);

    return (
        <div className={classes.container}>
            <IconButton onClick={() => navTo(baseLink)}>
                <MonetizationOnIcon fontSize="large" />
            </IconButton>
            <IconButton onClick={() => navTo(baseLink + '/cat')}>
                <CategoryIcon fontSize="large" />
            </IconButton>
            <IconButton onClick={() => navTo(baseLink + '/store')}>
                <StoreIcon fontSize="large" />
            </IconButton>
            <IconButton onClick={() => navTo('/users/app/settings')}>
                <SettingsApplicationsIcon fontSize="large" />
            </IconButton>
        </div>
    );
}

const mapStateToProps = state => {
    const { screenSelect } = state;
    console.log(state);
    return { ...screenSelect };
};

export default connect(mapStateToProps)(MobileNav);
