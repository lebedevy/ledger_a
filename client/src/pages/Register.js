import React, { useState, useEffect } from 'react';
import { TextField, Button, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { EmailInput, PasswordInput } from '../components/ContainedInput';

const backgroundImage = '/images/kim-gorga-bodXa3yTF0w-unsplash-min.jpg';
// const backgroundImage = '/images/kim-gorga-bodXa3yTF0w-unsplash.jpg';

const useStyles = makeStyles({
    container: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    background: {
        opacity: 0.85,
        background: '#000000',
        backgroundImage: `url(${backgroundImage})`,
        filter: 'grayscale(100%)',
        backgroundPosition: 'bottom right',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: -1,
    },
    input: {
        background: '#ffffff',
        borderRadius: '4px',
        // overflow: 'hidden',
    },
    button: {
        margin: '10px',
    },
    header: {
        color: '#ffffff',
    },
});

export default function Register({ history }) {
    const [loaded, setLoaded] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [confirmError, setConfirmError] = useState(null);
    const classes = useStyles();

    useEffect(() => setLoaded(true));

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
            {loaded ? (
                <div className={classes.background}>
                    <img
                        style={{ display: 'none' }}
                        src={backgroundImage}
                        title="Photo by Kim Gorga on Unsplash"
                    />
                </div>
            ) : null}
            <h2 className={classes.header}>Register</h2>
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
            <EmailInput value={email} update={value => setEmail(value)} />
            <PasswordInput value={password} update={value => setPassword(value)} />
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
            <Link className={classes.header} href="/users/login">
                Already have an account? Login
            </Link>
        </form>
    );
}
