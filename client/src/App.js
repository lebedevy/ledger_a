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
import LandingPage from './pages/LandingPage';
import EditExpense from './pages/EditExpense';
import Overview from './pages/Overview';

const styles = theme => ({
    container: {
        height: '100%',
        width: '100%',
        display: 'flex',
        background: '#00000020',
    },
    app: {
        paddingTop: '50px',
        boxSizing: 'border-box',
        height: '100%',
        width: '100%',
    },
});

class App extends Component {
    render() {
        const { classes, user } = this.props;
        return (
            <Router className={classes.container}>
                {user == null ? (
                    <Switch>
                        <Route exact path="/" component={LandingPage} />
                        <Route exact path="/users/register" component={Register} />
                        <Route exact path="/users/login" component={Login} />
                        <Route>
                            <Redirect to="/users/login" />
                        </Route>
                    </Switch>
                ) : (
                    <div className={classes.app}>
                        <Route component={Navbar} />
                        <Route component={AppDrawer} />
                        <Switch>
                            <Route exact path="/users/expenses/overview" component={Overview} />
                            <Route exact path="/users/expenses/summary" component={Expenses} />
                            <Route exact path="/users/expenses/add" component={AddExpense} />
                            <Route exact path="/users/expenses/edit/:id" component={EditExpense} />
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
                                <Redirect to="/users/expenses/overview/" />
                            </Route>
                        </Switch>
                    </div>
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
