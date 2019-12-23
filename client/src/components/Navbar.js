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

function Navbar({ openDrawer, history }) {
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
                <IconButton>
                    <MenuIcon className={classes.icon} onClick={openDrawer} />
                </IconButton>
                <IconButton>
                    <AccountCircleIcon className={classes.icon} onClick={openProfile} />
                    <Menu anchorEl={targetEl} open={Boolean(targetEl)} onClose={closeProfile}>
                        <MenuItem button onClick={logoutUser}>
                            Logout
                        </MenuItem>
                    </Menu>
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export default connect(null, { openDrawer })(Navbar);
