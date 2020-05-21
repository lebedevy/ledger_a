import React from 'react';
import { makeStyles } from '@material-ui/styles';
import clsx from 'clsx';

const useStyles = makeStyles({
    selectedTitle: {
        display: 'flex',
        flexDirection: 'column',
        padding: '15px 5px 5px 5px',
        '& h2': {
            wordBreak: 'break-all',
            '& label': {
                fontSize: '0.9em',
                fontStyle: 'italic',
                verticalAlign: 'center',
            },
        },
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        '& div': {
            height: '32px',
            width: '32px',
            borderRadius: '50%',
        },
    },
    marker: {
        marginRight: '10px',
    },
    empty: {
        border: '2px solid #CED0CE',
    },
});

export default function DetailsHeader({ selected, type }) {
    const classes = useStyles();
    return (
        <div className={classes.selectedTitle}>
            <div className={classes.header}>
                <div
                    className={clsx(classes.marker, !selected && classes.empty)}
                    style={{ background: `#${selected ? selected.el.color : 'ffffff'}` }}
                />
                {selected ? (
                    <h2>
                        Details:
                        <label>{`${
                            selected.el[type === 'category' ? 'category' : 'store']
                        }`}</label>
                    </h2>
                ) : (
                    <h2>Details</h2>
                )}
            </div>
            {!selected && (
                <label>{`Select a ${
                    type === 'category' ? 'category' : 'store'
                } from the graph or legend to see its details`}</label>
            )}
        </div>
    );
}
