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
        background: 'gray',
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
        '& button': {
            display: 'flex',
            alignItems: 'center',
            color: '#ffffff',
            fontSize: '1em',
            background: 'none',
            border: 'none',
            padding: '10px',
            margin: '10px',
            '&:hover': {
                background: '#00000020',
            },
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
        setPath(`/users/expenses/${screen === 0 ? 'overview' : 'summary'}/`);
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
        <div className={classes.container}>
            <div className={classes.appbar}>
                <div className={classes.options}>
                    <button onClick={() => navTo(path)}>
                        <MonetizationOnIcon />
                        All Expenses
                    </button>
                    <button onClick={() => navTo(path + 'cat')}>
                        <div>
                            <CategoryIcon />
                            By Category
                        </div>
                    </button>
                    <button onClick={() => navTo(path + 'store')}>
                        <StoreIcon />
                        By Store
                    </button>
                    <button onClick={() => setShowSetting(!showSetting)}>
                        <SettingsApplicationsIcon />
                        Period Settings
                    </button>
                    {showSetting ? <PeriodSettings close={() => setShowSetting(false)} /> : null}

                    {/* <IconButton>
                        <SettingsApplicationsIcon />
                    </IconButton> */}
                </div>
                <div className={classes.options}>
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
        // <AppBar>
        //     <Toolbar className={classes.appbar}>
        //         <IconButton onClick={openDrawer}>
        //             <MenuIcon className={classes.icon} />
        //         </IconButton>
        //         <IconButton onClick={openProfile}>
        //             <AccountCircleIcon className={classes.icon} />
        //         </IconButton>
        //         <Menu anchorEl={targetEl} open={Boolean(targetEl)} onClose={closeProfile}>
        //             <MenuItem button onClick={logoutUser}>
        //                 Logout
        //             </MenuItem>
        //         </Menu>
        //     </Toolbar>
        // </AppBar>
    );
}

const mapStateToProps = state => {
    const { screen } = state.screenSelect;
    return { screen };
};

export default connect(mapStateToProps, { openDrawer, logout })(Navbar);

const periodSetUseStyles = makeStyles({
    periodSetting: {
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
        color: 'black',
        background: '#ffffff',
        border: '1px solid #00000060',
        '& label': {
            display: 'block',
        },
    },
});

function PeriodSettings({ close }) {
    const classes = periodSetUseStyles();
    return (
        <div className={classes.periodSetting}>
            <div className={classes.backdrop} onClick={close} />
            <div
                className={classes.dateRangeContainer}
                onClick={e => {
                    e.preventDefault();
                    return false;
                }}
            >
                <h2>App Date Range</h2>
                <label>Select the date range for app data.</label>
                <label>Show expenses for period:</label>
                <DateRange />
            </div>
        </div>
    );
}
