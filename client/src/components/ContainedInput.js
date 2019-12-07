import React from 'react';
import { TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    input: {
        background: '#ffffff',
        borderRadius: '4px',
    },
});

export function EmailInput(props) {
    const classes = useStyles();
    return (
        <React.Fragment>
            <TextField
                className={classes.input}
                value={props.value}
                onChange={e => props.update(e.target.value)}
                placeholder="Email"
                type="email"
                required
                margin="dense"
                variant="outlined"
            />
        </React.Fragment>
    );
}

export function PasswordInput(props) {
    const classes = useStyles();
    return (
        <TextField
            className={classes.input}
            value={props.value}
            onChange={e => props.update(e.target.value)}
            placeholder="Password"
            type="password"
            required
            margin="dense"
            variant="outlined"
        />
    );
}
