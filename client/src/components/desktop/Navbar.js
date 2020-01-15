import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { AppBar, Toolbar, IconButton, Menu, MenuItem } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { makeStyles } from '@material-ui/styles';
import { openDrawer, logout } from '../../redux/actions';

import CategoryIcon from '@material-ui/icons/Category';
import StoreIcon from '@material-ui/icons/Store';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import DateRange from '../DateRange';

const useStyles = makeStyles({
    container: {
        position: 'fixed',
        display: 'flex',
        justifyContent: 'center',
        top: 0,
        right: 0,
        left: 0,
        height: '65px',
        background: '#353A47',
    },
    appbar: {
        width: '100%',
        maxWidth: '1200px',
        display: 'flex',
        justifyContent: 'space-between',
    },
    options: {
        display: 'flex',
        alignItems: 'center',
    },
    menuItem: {
        display: 'flex',
        alignItems: 'center',
        background: 'none',
        fontSize: '1em',
        border: 'none',
        padding: '10px',
        margin: '10px',
        color: '#ffffff',
        borderRadius: '2px',
        outlineColor: '#DC136C',
        userSelect: 'none',
        '&:hover': {
            background: '#00000020',
        },
        '& label': {
            paddingLeft: '5px',
        },
    },
    icon: {
        color: '#ffffff',
    },
});

function Navbar({ logout, openDrawer, history, screen }) {
    const classes = useStyles();
    const [targetEl, setTargetEl] = useState(null);
    const [showSetting, setShowSetting] = useState(false);
    const [path, setPath] = useState(null);

    useEffect(() => {
        setPath(`/users/expenses/get/${screen === 0 ? 'overview' : 'summary'}/`);
    }, [screen]);

    function navTo(path) {
        history.push(path);
    }

    function openProfile(e) {
        setTargetEl(e.currentTarget);
    }

    function closeProfile(e) {
        setTargetEl(null);
    }

    async function logoutUser() {
        logout();
        const res = await fetch('/api/users/logout', { method: 'POST' });
        if (res.status === 200) history.go('/users/login');
        closeProfile();
    }

    return (
        <React.Fragment>
            {showSetting ? <PeriodSettings close={() => setShowSetting(false)} /> : null}
            <div className={classes.container}>
                <div className={classes.appbar}>
                    <div className={classes.options}>
                        <button className={classes.menuItem} onClick={() => navTo(path)}>
                            <MonetizationOnIcon />
                            <label>All Expenses</label>
                        </button>
                        <button className={classes.menuItem} onClick={() => navTo(path + 'cat')}>
                            <CategoryIcon />
                            <label>By Category</label>
                        </button>
                        <button className={classes.menuItem} onClick={() => navTo(path + 'store')}>
                            <StoreIcon />
                            <label>By Store</label>
                        </button>
                    </div>
                    <div className={classes.options}>
                        <button
                            className={classes.menuItem}
                            onClick={() => setShowSetting(!showSetting)}
                        >
                            <SettingsApplicationsIcon />
                            <label>Period Settings</label>
                        </button>
                        <IconButton onClick={openProfile}>
                            <AccountCircleIcon className={classes.icon} />
                        </IconButton>
                        <Menu anchorEl={targetEl} open={Boolean(targetEl)} onClose={closeProfile}>
                            <MenuItem button onClick={logoutUser}>
                                Logout
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    const { screen } = state.screenSelect;
    return { screen };
};

export default connect(mapStateToProps, { openDrawer, logout })(Navbar);

const periodSetUseStyles = makeStyles({
    container: {
        zIndex: '1300',

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        background: '#00000040',
    },
    dateRangeContainer: {
        zIndex: 1,
        padding: '30px',
        width: '500px',
        color: 'black',
        background: '#ffffff',
        borderRadius: '5px',
        border: '1px solid #00000060',
        '& label': {
            display: 'block',
            padding: '3px',
        },
        '& h2': {
            margin: 0,
            marginBottom: '10px',
            textAlign: 'center',
        },
    },
});

function PeriodSettings({ close }) {
    const classes = periodSetUseStyles();
    return (
        <div className={classes.container}>
            <div className={classes.backdrop} onClick={close} />
            <div className={classes.dateRangeContainer}>
                <h2>App Date Range</h2>
                <label>Select the date range for app data.</label>
                <label>Show expenses for period:</label>
                <DateRange />
            </div>
        </div>
    );
}
