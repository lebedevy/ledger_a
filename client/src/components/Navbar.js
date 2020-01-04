import React, { useState } from 'react';
import { connect } from 'react-redux';
import { AppBar, Toolbar, IconButton, Menu, MenuItem } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { makeStyles } from '@material-ui/styles';
import { openDrawer, logout } from '../redux/actions';

const useStyles = makeStyles({
    appbar: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    icon: {
        color: '#ffffff',
    },
});

function Navbar({ logout, openDrawer, history }) {
    const classes = useStyles();
    const [targetEl, setTargetEl] = useState(null);

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
        <AppBar>
            <Toolbar className={classes.appbar}>
                <IconButton onClick={openDrawer}>
                    <MenuIcon className={classes.icon} />
                </IconButton>
                <IconButton onClick={openProfile}>
                    <AccountCircleIcon className={classes.icon} />
                </IconButton>
                <Menu anchorEl={targetEl} open={Boolean(targetEl)} onClose={closeProfile}>
                    <MenuItem button onClick={logoutUser}>
                        Logout
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}

export default connect(null, { openDrawer, logout })(Navbar);
