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
    },
    button: {
        margin: '10px',
    },
});

export default function Login({ history }) {
    const [email, setEmail] = useState('test@test.com');
    const [password, setPassword] = useState('test');
    const classes = useStyles();

    async function submit(e) {
        e.preventDefault();
        console.log(email, password);
        const res = await fetch('/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        console.log(res, history);
        if (res.status === 200) history.go('/users/login');
    }

    return (
        <form className={classes.container} onSubmit={e => submit(e)}>
            <h2>Login</h2>
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
            <Button className={classes.button} type="submit" variant="contained" color="primary">
                Login
            </Button>
        </form>
    );
}
