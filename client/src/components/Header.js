import React from 'react';
import { IconButton, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Dashboard from './SearchDashboard';
import SortIcon from '@material-ui/icons/Sort';
import DeleteIcon from '@material-ui/icons/Delete';
import { useSelector, useDispatch } from 'react-redux';
import { setDeletingMode } from '../redux/actions';

const useStyles = makeStyles({
    headerContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: '0 10px',
    },
});

export default function Header({ setOpen, open, title, dashboard, deleteExpenses, deleteAllowed }) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { deleting } = useSelector((state) => state.editing.deletingMode);

    return (
        <div className={classes.headerContainer}>
            <div className={classes.header}>
                <h2>{title}</h2>
                <div>
                    {deleteAllowed && (
                        <>
                            {deleting && (
                                <Button onClick={deleteExpenses} color="secondary">
                                    Delete
                                </Button>
                            )}
                            <IconButton onClick={() => dispatch(setDeletingMode(!deleting))}>
                                <DeleteIcon />
                            </IconButton>{' '}
                        </>
                    )}
                    <IconButton onClick={setOpen}>
                        <SortIcon className={classes.icon} />
                    </IconButton>
                </div>
            </div>
            {open ? <Dashboard {...dashboard} /> : null}
        </div>
    );
}
