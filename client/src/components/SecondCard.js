import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { IconButton, Button } from '@material-ui/core';
import SummaryItem from './SummaryItem';

const surpriseImage = '/images/icons8-embarrassed-64.png';
const walkingImage = '/images/icons8-walking-64.png';
const timeImage = '/images/icons8-clock-64.png';
// #C9D6EA

const pointOne =
    'Tracking your expenses can help you understand where your money is going, and avoid surprises';
const pointTwo = 'Log your expenses on the go, and stay up to date';
const pointThree = 'Anytime, anywhere';

const useStyles = makeStyles({
    presentation: {
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
    },
    firstDeskopt: {
        borderRadius: '2px',
        boxShadow: '5px 5px 5px #1A444F',
        margin: '25px',
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

function SecondCard() {
    const classes = useStyles();
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);

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

    return (
        <div
            className={clsx(classes.presentation, window.innerWidth > 600 && classes.firstDeskopt)}
            style={{ height: screenHeight - (screenWidth > 600 ? 50 : 0) }}
        >
            <div className={classes.summary}>
                <div className={classes.presentation}>
                    <SummaryItem image={surpriseImage} imageAlt="Surprise" label={pointOne} />
                    <SummaryItem image={walkingImage} label={pointTwo} />
                    <SummaryItem image={timeImage} imageAlt="Time" label={pointThree} />
                </div>
                <Button
                    href="/users/register"
                    color="secondary"
                    variant="contained"
                    className={classes.button}
                >
                    Sign up
                </Button>
            </div>
        </div>
    );
}

export default SecondCard;
