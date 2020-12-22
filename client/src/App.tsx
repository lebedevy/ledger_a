import React, { useEffect } from 'react';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { setScreenDimensions } from './redux/actions';

import AddExpense from './pages/AddExpense';
import Expenses from './pages/Expenses';
import ExpensesAggregates from './pages/ExpensesAggregates';
// import Merge from './pages/Merge';
import Navbar from './components/desktop/Navbar';
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
import { css, cx } from 'emotion';
import { RootState } from './components/typescript/general_interfaces';
import ExpenseList from './pages/ExpenseList';

const desktop = css`
    height: calc(100vh - 130px);
    margin-top: 130px;
`;

const mobileCss = css`
    margin: 0;
    margin: 8vh 0;
    overflow: hidden;
`;

export default function App() {
    const dispatch = useDispatch();
    const { user, height, mobile } = useSelector((state: RootState) => {
        const { user } = state;
        const { height, mobile } = state.screen;
        return { user, height, mobile };
    });

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleResize = () => {
        dispatch(setScreenDimensions({ height: window.innerHeight, width: window.innerWidth }));
    };

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
                <>
                    {!mobile ? (
                        <>
                            <Route component={Navbar} />
                            <Route path="/users/expenses/get/:type/" component={DesktopSubNav} />
                        </>
                    ) : (
                        <>
                            <Route path="/users/expenses/get/:type/" component={MobileSubNav} />
                            <Route path="/users/app/settings/" component={MobileSettingsNav} />
                        </>
                    )}
                    <div
                        className={cx(mobile ? mobileCss : desktop)}
                        style={mobile ? { minHeight: `calc(${height}px - 16vh)` } : {}}
                    >
                        <Switch>
                            <Route exact path="/users/expenses/get/overview" component={Overview} />
                            <Route
                                exact
                                path="/users/expenses/get/overview/list"
                                component={ExpenseList}
                            />
                            <Route
                                exact
                                path="/users/expenses/get/overview/:type"
                                component={CategoryOverview}
                            />
                            <Route exact path="/users/expenses/get/summary" component={Expenses} />
                            <Route exact path="/users/expenses/add" component={AddExpense} />
                            <Route exact path="/users/expenses/edit/:id" component={EditExpense} />
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
                            <Route path="/users/app/settings/account" component={MobileAccount} />
                            <Route path="/users/expenses/upload" component={UploadExpenses} />
                            <Route>
                                <Redirect to="/users/expenses/get/overview/" />
                            </Route>
                        </Switch>
                    </div>
                    {mobile && <Route component={MobileNav} />}
                </>
            )}
        </Router>
    );
}
