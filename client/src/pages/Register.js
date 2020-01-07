import React, { useState, useEffect } from 'react';
import { TextField, Button, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { EmailInput, PasswordInput } from '../components/ContainedInput';
import LoadingBackdrop from '../components/landing/LoadingBackdrop';

const backgroundImage = '/images/kim-gorga-bodXa3yTF0w-unsplash-min.jpg';
// const backgroundImage = '/images/kim-gorga-bodXa3yTF0w-unsplash.jpg';

const useStyles = makeStyles({
    container: {
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#00000055',
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
    error: {
        padding: '10px 0',
        color: 'red',
        fontWeight: '500',
        fontSize: '1.1em',
    },
});

export default function Register({ history }) {
    const [waitingRes, setWaitingRes] = useState(false);
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
        if (confirm !== password) setConfirmError('Please ensure passwords match');
        else {
            setConfirmError(null);
            setWaitingRes(true);
            const res = await fetch('/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, email, password, confirm }),
            });
            // Redirect to login on success, otherwise display fail message
            if (res.status === 200) {
                history.push('/users/login');
            } else {
                let message = await res.json();
                if (message) setConfirmError(message.message);
                else
                    setConfirmError(
                        'There was an error processing your request. Please try again later'
                    );
            }
            setWaitingRes(false);
        }
    }

    return (
        <form className={classes.container} onSubmit={e => submit(e)}>
            <LoadingBackdrop waitingRes={waitingRes} />
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
                placeholder="Confirm password"
                type="password"
                required
                margin="dense"
                variant="outlined"
            />
            {confirmError ? <label className={classes.error}>{confirmError}</label> : null}
            <Button
                disabled={waitingRes}
                className={classes.button}
                type="submit"
                variant="contained"
                color="primary"
            >
                Register
            </Button>
            <Link className={classes.header} href="/users/login">
                Already have an account? Login
            </Link>
        </form>
    );
}
