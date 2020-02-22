import React from 'react';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    image: {
        padding: '7px',
    },
    icon: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
    },
});

export default function LandingItem({ image, imageAlt, label }) {
    const classes = useStyles();
    return (
        <div className={classes.icon}>
            <img src={image} alt={imageAlt} />
            <label>{label}</label>
        </div>
    );
}
