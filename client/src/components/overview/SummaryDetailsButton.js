import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { IconButton } from '@material-ui/core';

const useStyles = makeStyles({
    showMore: {
        display: 'flex',
        justifyContent: 'center',
    },
    expanded: {
        paddingBottom: '10px',
    },
});

export default function SummaryDetailsButton({ expanded, setExpanded }) {
    const classes = useStyles();
    return (
        <div className={clsx(classes.showMore, expanded && classes.expanded)}>
            <IconButton onClick={() => setExpanded(!expanded)}>
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
        </div>
    );
}
