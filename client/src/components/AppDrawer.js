import React from 'react';
import { connect } from 'react-redux';
import { Drawer, List, ListItem } from '@material-ui/core';
import { closeDrawer } from '../redux/actions';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    header: {
        fontWeight: 'bold',
        fontSize: '1.2em',
        borderBottom: '1px solid #00000020',
    },
});

function AppDrawer({ open, closeDrawer, history }) {
    const classes = useStyles();

    function navTo(location) {
        console.log(location);
        history.push(location);
        closeDrawer();
    }

    return (
        <Drawer open={open} onClose={closeDrawer}>
            <List>
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
        </Drawer>
    );
}

const mapStateToProps = state => {
    const { drawer } = state;
    return { open: drawer.drawerState };
};

export default connect(mapStateToProps, { closeDrawer })(AppDrawer);
