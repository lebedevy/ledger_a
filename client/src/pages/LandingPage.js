import React from 'react';
import { makeStyles } from '@material-ui/styles';
import FirstCard from '../components/FirstCard';
import SecondCard from '../components/SecondCard';

const useStyles = makeStyles({
    container: {
        // background: 'gray',
        display: 'flex',
        flexDirection: 'column',
    },
    presentation: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    text: {},
    footer: {
        height: '75px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        background: 'gray',
    },
});

function LandingPage() {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <FirstCard />
            <SecondCard />
            <Footer />
        </div>
    );
}

function Footer() {
    const classes = useStyles();
    return (
        <footer className={classes.footer}>
            <div>
                <label>
                    Icons by{' '}
                    <a target="_blank" href="https://icons8.com">
                        Icons8
                    </a>
                </label>
            </div>
            <label>
                Website designed and built by{' '}
                <a href="https://personalwebsite-189620.web.app/">YL</a>
            </label>
        </footer>
    );
}

export default LandingPage;
