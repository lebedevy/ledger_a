import React from 'react';
import { connect } from 'react-redux';
import { Drawer, List, ListItem } from '@material-ui/core';
import { closeDrawer, logout } from '../redux/actions';
import { makeStyles } from '@material-ui/styles';
import DateRange from './DateRange';

const useStyles = makeStyles({
    drawer: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        paddingTop: '20px',
        fontWeight: 'bold',
        fontSize: '1.2em',
        borderBottom: '1px solid #00000020',
    },
});

function AppDrawer({ open, closeDrawer, history }) {
    const classes = useStyles();

    const navTo = location => {
        history.push(location);
        closeDrawer();
    };

    return (
        <Drawer open={open} onClose={closeDrawer}>
            <List className={classes.drawer}>
                <ListItem className={classes.header}>Expenses Summary</ListItem>
                <Section
                    name="All Expenses"
                    overviewLink="/users/expenses/overview/"
                    detailsLink="/users/expenses/summary/"
                    navTo={navTo}
                />
                <Section
                    name="By Categories"
                    overviewLink="/users/expenses/overview/cat"
                    detailsLink="/users/expenses/summary/cat"
                    navTo={navTo}
                />
                <Section
                    name="By Stores"
                    overviewLink="/users/expenses/overview/store"
                    detailsLink="/users/expenses/summary/store"
                    navTo={navTo}
                />
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

const useSectionStyles = makeStyles({
    subHeader: {
        width: '80%',
        paddingTop: '20px',
        fontWeight: 'bold',
        fontSize: '1em',
        borderBottom: '1px solid #00000020',
    },
});

function Section({ name, overviewLink, detailsLink, navTo }) {
    const classes = useSectionStyles();

    return (
        <React.Fragment>
            <ListItem className={classes.subHeader}>{name}</ListItem>
            <ListItem button onClick={() => navTo(overviewLink)}>
                Overview
            </ListItem>
            <ListItem button onClick={() => navTo(detailsLink)}>
                Details
            </ListItem>
        </React.Fragment>
    );
}
