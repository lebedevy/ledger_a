import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { IconButton, Button } from '@material-ui/core';
import SummaryItem from '../SummaryItem';

import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { connect } from 'react-redux';

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
        height: '98vh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '10px',
        background: '#ffffff',
        // background: 'linear-gradient(#FFFFFF,#E6E8E6)',
        '& label': {
            // color: 'white',
            fontWeight: 'bold',
            fontSize: '1.2em',
        },
        '& h2': {
            color: '#191919',
            fontSize: '2.5em',
        },
    },
    summaryMobile: {
        margin: '0 50px',
    },
    summary: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        maxHeight: '650px',
    },
    button: {
        marginTop: '10px',
        fontWeight: 'bold',
    },
    card: {
        display: 'flex',
    },
    mobile: {
        flexDirection: 'column',
    },
    desktop: {
        width: '600px',
        justifyContent: 'space-around',
        marginBottom: '50px',
    },
});

function Presentation({ mobile }) {
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
        <div className={classes.presentation}>
            <div className={clsx(classes.summary, mobile && classes.summaryMobile)}>
                <h2
                    className={
                        window.innerWidth < 601 ? classes.pageTitleMobile : classes.pageTitle
                    }
                >
                    HOW IT WORKS
                </h2>
                <div className={clsx(classes.card, mobile ? classes.mobile : classes.desktop)}>
                    <SummaryItem image={cardImage} imageAlt="Credit Card" label="Spend" />
                    <SummaryItem image={recordImage} imageAlt="Notebook" label="Log" />
                    <SummaryItem image={analyzeImage} imageAlt="Analyze" label="Analyze" />
                </div>

                <Button
                    href="/users/register"
                    color="secondary"
                    variant="contained"
                    className={classes.button}
                >
                    GET STARTED
                </Button>
            </div>
        </div>
    );
}

const mapStateToProps = state => {
    const { mobile } = state.screen;
    return { mobile };
};

export default connect(mapStateToProps)(Presentation);

//   <React.Fragment>
//       <SummaryItem image={surpriseImage} imageAlt="Surprise" label={pointOne} />
//       <SummaryItem image={walkingImage} label={pointTwo} />
//       <SummaryItem image={timeImage} imageAlt="Time" label={pointThree} />
//   </React.Fragment>;
