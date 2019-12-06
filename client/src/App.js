import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/styles';

import AddExpense from './pages/AddExpense';
import Expenses from './pages/Expenses';
import ExpensesAggregates from './pages/ExpensesAggregates';
import Merge from './pages/Merge';
import Navbar from './components/Navbar';
import AppDrawer from './components/AppDrawer';
import Register from './pages/Register';
import Login from './pages/Login';

const styles = theme => ({
    container: {
        height: '100%',
        width: '100%',
        display: 'flex',
        background: '#00000020',
    },
});

class App extends Component {
    // async componentDidMount() {
    //     const res = await fetch('/');
    //     console.log(res);
    // }

    render() {
        const { classes, user } = this.props;
        console.log(this.props);
        return (
            <Router className={classes.container}>
                {user == null ? (
                    <Switch>
                        <Route exact path="/users/register" component={Register} />
                        <Route exact path="/users/login" component={Login} />
                        <Route>
                            <Redirect to="/users/login" />
                        </Route>
                    </Switch>
                ) : (
                    <React.Fragment>
                        <Route component={Navbar} />
                        <Route component={AppDrawer} />
                        <Switch>
                            <Route exact path="/users/expenses/summary">
                                <Expenses />
                            </Route>
                            <Route exact path="/users/expenses/add">
                                <AddExpense />
                            </Route>
                            <Route
                                exact
                                path="/users/expenses/summary/:type"
                                render={props => <ExpensesAggregates {...props} />}
                            />
                            <Route
                                exact
                                path="/users/expenses/manage/merge/:type"
                                render={props => <Merge {...props} />}
                            />
                            <Route>
                                <Redirect to="/users/expenses/summary" />
                            </Route>
                        </Switch>
                    </React.Fragment>
                )}
            </Router>
        );
    }
}

const mapStateToProps = state => {
    const { user } = state;
    return { user };
};

export default connect(mapStateToProps)(withStyles(styles)(App));
