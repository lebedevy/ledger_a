import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
import { mergeClasses, makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    container: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#00000020',
    },
    input: {
        background: '#ffffff',
        borderRadius: '4px',
        // overflow: 'hidden',
    },
    button: {
        margin: '10px',
    },
});

export default function Register({ history }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [confirmError, setConfirmError] = useState(null);
    const classes = useStyles();

    async function submit(e) {
        e.preventDefault();
        console.log(email, password, confirm, firstName, lastName);
        if (confirm !== password) setConfirmError('Please ensure passwords match!');
        else {
            setConfirmError(null);
            const res = await fetch('/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, email, password, confirm }),
            });
            console.log(res, history);
            if (res.status === 200) history.push('/users/login');
        }
    }

    return (
        <form className={classes.container} onSubmit={e => submit(e)}>
            <h2>Register</h2>
            <TextField
                className={classes.input}
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                placeholder="First Name"
                required
                margin="dense"
                variant="outlined"
            />
            <TextField
                className={classes.input}
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                placeholder="Last Name"
                required
                margin="dense"
                variant="outlined"
            />
            <TextField
                className={classes.input}
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
                type="email"
                required
                margin="dense"
                variant="outlined"
            />
            <TextField
                className={classes.input}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
                required
                margin="dense"
                variant="outlined"
            />
            <TextField
                className={classes.input}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                error={Boolean(confirmError)}
                helperText={confirmError}
                placeholder="Confirm password"
                type="password"
                required
                margin="dense"
                variant="outlined"
            />
            <Button className={classes.button} type="submit" variant="contained" color="primary">
                Register
            </Button>
        </form>
    );
}
