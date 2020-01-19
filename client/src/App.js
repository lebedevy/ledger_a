import React, { Component } from 'react';
import clsx from 'clsx';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/styles';
import { setScreenDimensions } from './redux/actions';

import AddExpense from './pages/AddExpense';
import Expenses from './pages/Expenses';
import ExpensesAggregates from './pages/ExpensesAggregates';
import Merge from './pages/Merge';
import Navbar from './components/desktop/Navbar';
import AppDrawer from './components/AppDrawer';
import Register from './pages/Register';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import EditExpense from './pages/EditExpense';
import Overview from './pages/Overview';
import CategoryOverview from './pages/AggregateOverview';
import MobileNav from './components/mobile/MobileNav';
import MobileSubNav from './components/mobile/MobileSubNav';
import MobileSettingsNav from './components/mobile/MobileSettingsNav';
import AppSettings from './components/mobile/MobileSettings';
import MobileAccount from './components/mobile/MobileAccount';
import DesktopSubNav from './components/desktop/DesktopSubNav';
import UploadExpenses from './pages/UploadExpenses';

const styles = theme => ({
    container: {
        height: '100%',
        width: '100%',
        display: 'flex',
        background: '#00000020',
    },
    // app: {
    //     maxHeight: '100%',
    //     maxWidth: '100%',
    //     position: 'relative',
    // },
    desktop: {
        height: 'calc(100vh - 130px)',
        marginTop: '130px',
    },
    mobile: {
        // height: '84vh',
        // maxHeight: 'calc(100% - 16vh)',
        margin: 0,
        margin: '8vh 0',
        overflow: 'hidden',
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
        const { classes, user, width, height, mobile } = this.props;
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
                        {!mobile ? (
                            <React.Fragment>
                                <Route component={Navbar} />
                                <Route
                                    path="/users/expenses/get/:type/"
                                    component={DesktopSubNav}
                                />
                            </React.Fragment>
                        ) : (
                            <React.Fragment>
                                <Route path="/users/expenses/get/:type/" component={MobileSubNav} />
                                <Route path="/users/app/settings/" component={MobileSettingsNav} />
                            </React.Fragment>
                        )}
                        <div
                            className={clsx(mobile ? classes.mobile : classes.desktop)}
                            style={mobile ? { minHeight: `calc(${height}px - 16vh)` } : {}}
                        >
                            <Switch>
                                <Route
                                    exact
                                    path="/users/expenses/get/overview"
                                    component={Overview}
                                />
                                <Route
                                    exact
                                    path="/users/expenses/get/overview/:type"
                                    component={CategoryOverview}
                                />
                                <Route
                                    exact
                                    path="/users/expenses/get/summary"
                                    component={Expenses}
                                />
                                <Route exact path="/users/expenses/add" component={AddExpense} />
                                <Route
                                    exact
                                    path="/users/expenses/edit/:id"
                                    component={EditExpense}
                                />
                                <Route
                                    exact
                                    path="/users/expenses/get/summary/:type"
                                    component={ExpensesAggregates}
                                />
                                {/* <Route
                                    exact
                                    path="/users/expenses/manage/merge/:type"
                                    render={props => <Merge {...props} />}
                                /> */}
                                <Route path="/users/app/settings/app" component={AppSettings} />
                                <Route
                                    path="/users/app/settings/account"
                                    component={MobileAccount}
                                />
                                <Route path="/users/expenses/upload" component={UploadExpenses} />
                                <Route>
                                    <Redirect to="/users/expenses/get/overview/" />
                                </Route>
                            </Switch>
                        </div>
                        {mobile ? <Route component={MobileNav} /> : null}
                    </React.Fragment>
                )}
            </Router>
        );
    }
}

const mapStateToProps = state => {
    const { user } = state;
    const { width, height, mobile } = state.screen;
    return { user, width, height, mobile };
};

export default connect(mapStateToProps, { setScreenDimensions })(withStyles(styles)(App));
