import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { IconButton, Button } from '@material-ui/core';
import SummaryItem from '../SummaryItem';

import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';

const cardImage = '/images/icons8-card-payment-80.png';
const recordImage = '/images/icons8-book-and-pencil-100.png';
const analyzeImage = '/images/icons8-analyze-80.png';
// #C9D6EA

const surpriseImage = '/images/icons8-embarrassed-64.png';
const walkingImage = '/images/icons8-walking-64.png';
const timeImage = '/images/icons8-clock-64.png';

const pointOne =
    'Tracking your expenses can help you understand where your money is going, and avoid surprises';
const pointTwo = 'Log your expenses on the go, and stay up to date';
const pointThree = 'Anytime, anywhere';

const useStyles = makeStyles({
    pageTitle: {
        fontSize: '4em',
    },
    pageTitleMobile: {
        fontSize: '3em',
        margin: '5px auto',
    },
    presentation: {
        height: '100vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '10px',
        background: 'linear-gradient(#96C3CE,#73C1C6)',
        '& label': {
            color: 'white',
            fontSize: '1.2em',
        },
        '& h1': {
            color: '#ffffff',
        },
    },
    summaryMobile: {
        margin: '0 50px',
    },
    summary: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        marginTop: '10px',
        fontWeight: 'bold',
    },
});

export default function Presentation() {
    const classes = useStyles();
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [presentation, setPresentation] = useState(0);

    useEffect(() => {
        function handleResize() {
            setScreenWidth(window.innerWidth);
            if (Math.abs(screenHeight - window.innerHeight) > 50)
                setScreenHeight(window.innerHeight);
        }
        window.addEventListener('resize', handleResize);

        return () => {
            // clean up function
            window.removeEventListener('resize', handleResize);
        };
    });

    function changePresentation() {
        setPresentation(presentation === 1 ? 0 : 1);
    }

    return (
        <div className={classes.presentation}>
            <NavButton
                dir={presentation ? 'left' : 'right'}
                changePresentation={changePresentation}
            />
            <div className={clsx(classes.summary, screenWidth <= 600 && classes.summaryMobile)}>
                <h1
                    className={
                        window.innerWidth < 601 ? classes.pageTitleMobile : classes.pageTitle
                    }
                >
                    Ledger A
                </h1>
                {presentation ? (
                    <React.Fragment>
                        <SummaryItem image={surpriseImage} imageAlt="Surprise" label={pointOne} />
                        <SummaryItem image={walkingImage} label={pointTwo} />
                        <SummaryItem image={timeImage} imageAlt="Time" label={pointThree} />
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <SummaryItem image={cardImage} imageAlt="Credit Card" label="Spend" />
                        <SummaryItem image={recordImage} imageAlt="Notebook" label="Log" />
                        <SummaryItem image={analyzeImage} imageAlt="Analyze" label="Analyze" />
                    </React.Fragment>
                )}

                <Button
                    href="/users/register"
                    color="secondary"
                    variant="contained"
                    className={classes.button}
                >
                    Register
                </Button>
            </div>
        </div>
    );
}

const useButStyles = makeStyles({
    button: {
        background: '#',
        position: 'absolute',
        top: '50%',
        marginTop: '10px',
        fontWeight: 'bold',
        background: '#BA5624',
        color: 'black',
        marginBottom: '10px',
    },
    right: {
        right: '10px',
    },
    left: {
        left: '10px',
    },
});

function NavButton({ dir, changePresentation }) {
    const classes = useButStyles();
    return (
        <IconButton onClick={changePresentation} className={clsx(classes.button, classes[dir])}>
            {dir === 'right' ? <KeyboardArrowRightIcon /> : <KeyboardArrowLeftIcon />}
        </IconButton>
    );
}
