import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';

import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';

const useStyles = makeStyles({
    legendMobile: {
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        maxWidth: '200px',
        top: 0,
        right: 0,
    },
    open: {
        bottom: 0,
        overflow: 'auto',
        background: '#00000070',
    },
    legendOpenButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px',
        fontWeight: 'bold',
    },
    legendOpenTitle: {
        color: 'white',
    },
    legendTitleMobile: {
        flex: 1,
        textAlign: 'center',
    },
});

export default function MobileLegend({ open, setLegendOpen, data, common, setSelected }) {
    const classes = useStyles();
    return (
        <div className={clsx(classes.legendMobile, open && classes.open)}>
            <div>
                <div
                    className={clsx(classes.legendOpenButton, open && classes.legendOpenTitle)}
                    onClick={() => setLegendOpen(!open)}
                    title={open ? 'Hide legend' : 'Show legend'}
                >
                    {open ? <KeyboardArrowRightIcon /> : <KeyboardArrowLeftIcon />}
                    <label className={classes.legendTitleMobile}>Legend</label>
                </div>
            </div>
            {open ? (
                <div>
                    {data.map((el, ind) => (
                        <div
                            key={el.id}
                            className={common.legendItem}
                            style={{ background: `#${el.color}` }}
                            onClick={() => setSelected(el)}
                        >
                            <label className={common.label}>
                                {el['category_name'] ? el['category_name'] : el['store_name']}
                            </label>
                            <label>{` ${Math.round(el.percent * 100)}%`}</label>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
}
