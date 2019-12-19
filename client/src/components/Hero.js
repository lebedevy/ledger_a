import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { IconButton } from '@material-ui/core';

const backgroundImage = '/images/kamil-feczko-GhxWry42_zQ-unsplash.jpg';

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
        zIndex: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        '& label': {
            color: 'white',
            fontSize: '1.2em',
        },
        '& h1': {
            color: '#ffffff',
        },
    },
    backdrop: {
        opacity: 0.8,
        position: 'absolute',
        filter: 'grayscale(100%)',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
    },
    summary: {
        zIndex: 2,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    moreButton: {
        marginTop: '10px',
        fontWeight: 'bold',
        background: '#BA5624',
        color: 'black',
        marginBottom: '10px',
    },
});

export default function Hero() {
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
            <div className={classes.backdrop} />
            <div className={classes.summary}>
                <h1
                    className={clsx(
                        classes.pageTitle,
                        window.innerWidth < 601 ? classes.pageTitleMobile : null
                    )}
                >
                    Ledger A
                </h1>
                <label>Your expenses shouldn't be a mystery</label>
            </div>
            <IconButton className={clsx(classes.moreButton)}>
                <ExpandMoreIcon
                    fontSize={screenWidth > 600 ? 'medium' : 'small'}
                    onClick={() =>
                        window.scrollTo({
                            top: screenHeight,
                            behavior: 'smooth',
                        })
                    }
                />
            </IconButton>
        </div>
    );
}
