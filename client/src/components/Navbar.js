import React from 'react';
import { connect } from 'react-redux';
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/styles';
import { openDrawer } from '../redux/actions';

const useStyles = makeStyles({
    appbar: {},
    icon: {
        color: '#ffffff',
    },
});

function Navbar({ openDrawer }) {
    const classes = useStyles();
    console.log(openDrawer);
    return (
        <AppBar>
            <Toolbar>
                <IconButton>
                    <MenuIcon className={classes.icon} onClick={openDrawer} />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export default connect(null, { openDrawer })(Navbar);
