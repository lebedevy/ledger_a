import React from 'react';
import { connect } from 'react-redux';
import { Drawer, List, ListItem } from '@material-ui/core';
import { closeDrawer, logout } from '../redux/actions';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    header: {
        fontWeight: 'bold',
        fontSize: '1.2em',
        borderBottom: '1px solid #00000020',
    },
    drawer: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    logout: {
        borderTop: '1px solid #00000050',
        height: '70px',
        alignSelf: 'flex-end',
        background: '#00000010',
    },
});

function AppDrawer({ open, closeDrawer, history, setUser, logout }) {
    const classes = useStyles();

    function navTo(location) {
        console.log(location);
        history.push(location);
        closeDrawer();
    }

    async function logoutUser() {
        logout();
        const res = await fetch('/api/users/logout', { method: 'POST' });
        console.log(res);
        if (res.status === 2000) history.go('/users/login');
        closeDrawer();
    }

    return (
        <Drawer open={open} onClose={closeDrawer}>
            <List className={classes.drawer}>
                <ListItem className={classes.header}>Expenses Summary</ListItem>
                <ListItem button onClick={() => navTo('/users/expenses/summary/')}>
                    By period
                </ListItem>
                <ListItem button onClick={() => navTo('/users/expenses/summary/store')}>
                    By store
                </ListItem>
                <ListItem button onClick={() => navTo('/users/expenses/summary/cat')}>
                    By category
                </ListItem>
            </List>
            <ListItem button onClick={logoutUser} className={classes.logout}>
                Logout
            </ListItem>
        </Drawer>
    );
}

const mapStateToProps = state => {
    const { drawer } = state;
    return { open: drawer.drawerState };
};

const mapDispatchToProps = { closeDrawer, logout };

export default connect(mapStateToProps, mapDispatchToProps)(AppDrawer);
