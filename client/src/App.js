import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { withStyles } from '@material-ui/styles';

import AddExpense from './pages/AddExpense';
import Expenses from './pages/Expenses';

const styles = theme => ({
    container: {
        height: '100%',
        width: '100%',
        display: 'flex',
        background: '#00000020',
    },
});

class App extends Component {
    async componentDidMount() {
        const res = await fetch('/');
        console.log(res);
        const data = await res.json();
        console.log(data);
    }
    render() {
        const { classes } = this.props;
        return (
            <Router className={classes.container}>
                <Switch>
                    <Route exact path="/">
                        <Expenses />
                    </Route>
                    <Route exact path="/users/expenses/add">
                        <AddExpense />
                    </Route>
                </Switch>
            </Router>
        );
    }
}

export default withStyles(styles)(App);
