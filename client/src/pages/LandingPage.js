import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Hero from '../components/landing/Hero';
import Presentation from '../components/landing/Presentation';

const useStyles = makeStyles({
    container: {
        // background: 'gray',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(#1e1e1e 50%, #515151, #0f0f0f)',
    },
    presentation: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    footer: {
        height: '100px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        // background: '#5D576B',
        color: '#ffffff',
    },
});

function LandingPage() {
    const classes = useStyles();
    return (
        <div className={classes.container}>
            <Hero />
            <Presentation />
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
                    Icons by <a href="https://icons8.com">Icons8</a>
                </label>
            </div>
            <label>
                Photo by{' '}
                <a href="https://unsplash.com/@feczys?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
                    Kamil Feczko
                </a>
                {' on '}
                <a href="https://unsplash.com/s/photos/mystery?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
                    Unsplash
                </a>
            </label>
            <label>
                Website designed and built by{' '}
                <a href="https://personalwebsite-189620.web.app/">YL</a>
            </label>
        </footer>
    );
}

export default LandingPage;
