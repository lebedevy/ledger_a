import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { IconButton } from '@material-ui/core';
import { connect } from 'react-redux';

const useStyles = makeStyles({
    showMore: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        '& label': {
            fontSize: '0.9em',
            // fontStyle: 'italic',
        },
        '& button': {
            background: '#E6E8E6',
        },
    },
    expanded: {
        paddingBottom: '10px',
    },
    mobile: {
        marginTop: '10px',
    },
});

function SummaryDetailsButton({ expanded, setExpanded, mobile }) {
    const classes = useStyles();
    return (
        <div
            className={clsx(
                classes.showMore,
                expanded && classes.expanded,
                mobile && classes.mobile
            )}
        >
            {!expanded && <label>Expand for Details</label>}
            <IconButton onClick={() => setExpanded(!expanded)}>
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
        </div>
    );
}

const mapStateToProps = state => {
    const { mobile } = state.screen;
    return { mobile };
};

export default connect(mapStateToProps)(SummaryDetailsButton);
