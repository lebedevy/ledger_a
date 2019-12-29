import React from 'react';
import { makeStyles } from '@material-ui/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { IconButton } from '@material-ui/core';

const useStyles = makeStyles({
    showMore: {
        display: 'flex',
        justifyContent: 'center',
    },
});

export default function SummaryDetailsButton({ expanded, setExpanded }) {
    const classes = useStyles();
    return (
        <div className={classes.showMore}>
            <IconButton onClick={() => setExpanded(!expanded)}>
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
        </div>
    );
}
