import React from 'react';
import { connect } from 'react-redux';
import { Drawer, List, ListItem } from '@material-ui/core';
import { closeDrawer, logout } from '../redux/actions';
import { makeStyles } from '@material-ui/styles';
import DateRange from './DateRange';

const useStyles = makeStyles({
    header: {
        paddingTop: '20px',
        fontWeight: 'bold',
        fontSize: '1.2em',
        borderBottom: '1px solid #00000020',
    },
    drawer: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
});

function AppDrawer({ open, closeDrawer, history }) {
    const classes = useStyles();

    function navTo(location) {
        history.push(location);
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
                <ListItem className={classes.header}>Global Filters</ListItem>
                <ListItem>Expenses period:</ListItem>
                <DateRange />
            </List>
        </Drawer>
    );
}

const mapStateToProps = state => {
    const { drawer } = state;
    return { open: drawer.drawerState };
};

const mapDispatchToProps = { closeDrawer };

export default connect(mapStateToProps, mapDispatchToProps)(AppDrawer);
