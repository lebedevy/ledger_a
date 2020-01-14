import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { IconButton } from '@material-ui/core';
import { connect } from 'react-redux';

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
        height: '98vh',
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
        '& label': {
            opacity: 0,
            animation: '4s fade-in-title 1s forwards',
        },
        '& h1': {
            opacity: 0,
            animation: '4s fade-in-title 3s forwards',
        },
    },
    moreButton: {
        marginTop: '10px',
        fontWeight: 'bold',
        background: '#BA5624',
        color: 'black',
        marginBottom: '10px',
        opacity: 0,
        animation: '4s fade-in-title 3s forwards',
    },
});

function Hero({ height, mobile }) {
    const classes = useStyles();

    return (
        <div className={classes.presentation}>
            <div className={classes.backdrop} />
            <div className={classes.summary}>
                <h1 className={clsx(classes.pageTitle, mobile && classes.pageTitleMobile)}>
                    LEDGER A
                </h1>
                <label>Your expenses shouldn't be a mystery</label>
            </div>
            <IconButton
                className={clsx(classes.moreButton)}
                onClick={() =>
                    window.scrollTo({
                        top: height,
                        behavior: 'smooth',
                    })
                }
            >
                <ExpandMoreIcon fontSize={mobile ? 'small' : 'medium'} />
            </IconButton>
        </div>
    );
}

const mapStateToProps = state => {
    const { mobile, height } = state.screen;
    return { mobile, height };
};

export default connect(mapStateToProps)(Hero);
