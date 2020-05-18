import React, { useState, useEffect } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { logout } from '../../redux/actions';
import CategoryIcon from '@material-ui/icons/Category';
import StoreIcon from '@material-ui/icons/Store';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import DateRange from '../DateRange';
import { css } from 'emotion';
import { useHistory } from 'react-router-dom';

const container = css`
    position: fixed;
    display: flex;
    justify-content: center;
    top: 0;
    right: 0;
    left: 0;
    height: 65px;
    background: #353a47;
`;

const appbar = css`
    width: 100%;
    max-width: 1200px;
    display: flex;
    justify-content: space-between;
`;

const menuItem = css`
    display: flex;
    align-items: center;
    background: none;
    font-size: 1em;
    border: none;
    padding: 10px;
    margin: 10px;
    color: #ffffff;
    border-radius: 2px;
    outline-color: #dc136c;
    user-select: none;
    label {
        padding-left: 5px;
    }
`;

const icon = css`
    color: #ffffff;
`;

const options = css`
    display: flex;
    align-items: center;
`;

export default function Navbar() {
    const history = useHistory();
    const dispatch = useDispatch();
    const { screen } = useSelector((state) => state.screenSelect);
    const [targetEl, setTargetEl] = useState(null);
    const [showSetting, setShowSetting] = useState(false);
    const [basePath, setBasePath] = useState(null);
    const [path, setPath] = useState(null);

    useEffect(() => {
        setBasePath(`/users/expenses/`);
        setPath(`/users/expenses/get/${screen === 0 ? 'overview' : 'summary'}/`);
    }, [screen]);

    const navTo = (path) => history.push(path);

    const openProfile = (e) => setTargetEl(e.currentTarget);

    const closeProfile = () => setTargetEl(null);

    async function logoutUser() {
        dispatch(logout());
        const res = await fetch('/api/users/logout', { method: 'POST' });
        if (res.status === 200) history.go('/users/login');
        closeProfile();
    }

    return (
        <>
            {showSetting && <PeriodSettings close={() => setShowSetting(false)} />}
            <div className={container}>
                <div className={appbar}>
                    <div className={options}>
                        <button className={menuItem} onClick={() => navTo(path)}>
                            <MonetizationOnIcon />
                            <label>All Expenses</label>
                        </button>
                        <button className={menuItem} onClick={() => navTo(path + 'category')}>
                            <CategoryIcon />
                            <label>By Category</label>
                        </button>
                        <button className={menuItem} onClick={() => navTo(path + 'store')}>
                            <StoreIcon />
                            <label>By Store</label>
                        </button>
                    </div>
                    <div className={options}>
                        <button className={menuItem} onClick={() => navTo(basePath + 'upload')}>
                            <PublishIcon />
                        </button>
                        <button className={menuItem} onClick={() => setShowSetting(!showSetting)}>
                            <SettingsApplicationsIcon />
                            <label>Period Settings</label>
                        </button>
                        <IconButton onClick={openProfile}>
                            <AccountCircleIcon className={icon} />
                        </IconButton>
                        <Menu anchorEl={targetEl} open={Boolean(targetEl)} onClose={closeProfile}>
                            <MenuItem button onClick={logoutUser}>
                                Logout
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
            </div>
        </>
    );
}

const containerCss = css`
    z-index: 1300;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
`;

const backdrop = css`
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: #00000040;
`;

const dateRangeContainer = css`
    z-index: 1;
    padding: 30px;
    width: 500px;
    color: black;
    background-color: #ffffff;
    border-radius: 5px;
    border: 1px solid #00000060;
    label {
        display: block;
        padding: 3px;
    }
    h2 {
        margin: 0;
        marginbottom: 10px;
        textalign: center;
    }
`;

function PeriodSettings({ close }) {
    return (
        <div className={containerCss}>
            <div className={backdrop} onClick={close} />
            <div className={dateRangeContainer}>
                <h2>App Date Range</h2>
                <label>Select the date range for app data.</label>
                <label>Show expenses for period:</label>
                <DateRange />
            </div>
        </div>
    );
}
