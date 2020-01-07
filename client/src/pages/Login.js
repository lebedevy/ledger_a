import React, { useState, useEffect } from 'react';
import { Button, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { EmailInput, PasswordInput } from '../components/ContainedInput';
import LoadingBackdrop from './LoadingBackdrop';

// const backgroundImage = '/images/fabian-blank-pElSkGRA2NU-unsplash.jpg';
const backgroundImage = '/images/fabian-blank-pElSkGRA2NU-unsplash-min.jpg';

const useStyles = makeStyles({
    container: {
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    background: {
        // background: 'linear-gradient(white, gray)',
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: 'bottom center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: -1,
    },
    button: {
        margin: '10px',
    },
    error: {
        color: 'red',
        textAlign: 'center',
    },
});

export default function Login({ history }) {
    const [waitingRes, setWaitingRes] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(null);
    const classes = useStyles();

    useEffect(() => setLoaded(true), []);

    async function submit(e) {
        e.preventDefault();
        setWaitingRes(true);
        const res = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (res.status === 200) history.go('/users/login');
        else {
            if (res.status === 400)
                setLoginError('Please ensure your password and email are correct');
            if (res.status === 500) setLoginError('Server error. Please try again later.');
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
                        title="Photo by Fabian Blank on Unsplash"
                        alt="Piggy bank"
                    />
                </div>
            ) : null}
            <h2>Login</h2>
            <EmailInput value={email} update={value => setEmail(value)} />
            <PasswordInput value={password} update={value => setPassword(value)} />
            {loginError ? <label className={classes.error}>{loginError}</label> : null}
            <Button
                disabled={waitingRes}
                className={classes.button}
                type="submit"
                variant="contained"
                color="primary"
            >
                Login
            </Button>
            <Link href="/users/register">New? Register here</Link>
        </form>
    );
}
