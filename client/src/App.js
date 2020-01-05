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
import CategoryOverview from './pages/AggregateOverview';
import { setScreenDimensions } from './redux/actions';
import MobileNav from './components/mobile/MobileNav';
import MobileSubNav from './components/mobile/MobileSubNav';
import MobileSettingsNav from './components/mobile/MobileSettingsNav';
import AppSettings from './components/mobile/MobileSettings';
import MobileAccount from './components/mobile/MobileAccount';
import clsx from 'clsx';

const styles = theme => ({
    container: {
        height: '100%',
        width: '100%',
        display: 'flex',
        background: '#00000020',
    },
    app: {
        // paddingTop: '50px',
        boxSizing: 'border-box',
        maxHeight: '100%',
        maxWidth: '100%',
        position: 'relative',
    },
    desktop: {
        height: '100vh',
    },
    mobile: {
        height: '84vh',
        margin: 0,
        margin: '8vh 0',
        overflow: 'auto',
    },
});

class App extends Component {
    constructor(props) {
        super(props);
        this.handleResize = this.handleResize.bind(this);
    }
    handleResize() {
        this.props.setScreenDimensions({ height: window.innerHeight, width: window.innerWidth });
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    render() {
        const { classes, user, width } = this.props;
        console.log(width);
        return (
            <Router>
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
                    <React.Fragment>
                        <div
                            className={classes.app}
                            // style={{ marginBottom: width > 600 ? 0 : '8vh' }}
                        >
                            {width > 600 ? (
                                <React.Fragment>
                                    <Route component={Navbar} />
                                    <Route component={AppDrawer} />
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <Route path="/users/expenses/:type/" component={MobileSubNav} />
                                    <Route
                                        path="/users/app/settings/"
                                        component={MobileSettingsNav}
                                    />
                                </React.Fragment>
                            )}
                            <div className={clsx(width > 600 ? classes.desktop : classes.mobile)}>
                                <Switch>
                                    <Route
                                        exact
                                        path="/users/expenses/overview"
                                        component={Overview}
                                    />
                                    <Route
                                        exact
                                        path="/users/expenses/overview/:type"
                                        component={CategoryOverview}
                                    />
                                    <Route
                                        exact
                                        path="/users/expenses/summary"
                                        component={Expenses}
                                    />
                                    <Route
                                        exact
                                        path="/users/expenses/add"
                                        component={AddExpense}
                                    />
                                    <Route
                                        exact
                                        path="/users/expenses/edit/:id"
                                        component={EditExpense}
                                    />
                                    <Route
                                        exact
                                        path="/users/expenses/summary/:type"
                                        component={ExpensesAggregates}
                                    />
                                    <Route
                                        exact
                                        path="/users/expenses/manage/merge/:type"
                                        render={props => <Merge {...props} />}
                                    />
                                    <Route path="/users/app/settings/app" component={AppSettings} />
                                    <Route
                                        path="/users/app/settings/account"
                                        component={MobileAccount}
                                    />
                                    <Route>
                                        <Redirect to="/users/expenses/overview/" />
                                    </Route>
                                </Switch>
                            </div>
                            {width < 601 ? <Route component={MobileNav} /> : null}
                        </div>
                    </React.Fragment>
                )}
            </Router>
        );
    }
}

const mapStateToProps = state => {
    const { user } = state;
    return { user, width: state.screen.width };
};

export default connect(mapStateToProps, { setScreenDimensions })(withStyles(styles)(App));
