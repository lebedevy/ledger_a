import React, { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';

import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import PieLegendDisplayOptions from './PieLegendDisplayOptions';
import { getCurrencyFormat } from '../../../utility/utility';

const useStyles = makeStyles({
    container: {
        position: 'absolute',
        display: 'flex',
        top: 0,
        right: 0,
    },
    legendMobile: {
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '200px',
    },
    legendOpen: {
        background: '#00000070',
        overflow: 'auto',
        width: '200px',
    },
    backdrop: {
        background: '#00000020',
        flex: 1,
    },
    open: {
        bottom: 0,
        left: 0,
        right: 0,
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
    const [totals, setTotals] = useState(false);

    return (
        <div className={clsx(classes.container, open && classes.open)}>
            {open ? (
                <div className={classes.backdrop} onClick={() => setLegendOpen(false)} />
            ) : null}
            <div className={clsx(classes.legendMobile, open && classes.legendOpen)}>
                <div
                    className={clsx(classes.legendOpenButton, open && classes.legendOpenTitle)}
                    onClick={() => setLegendOpen(!open)}
                    title={open ? 'Hide legend' : 'Show legend'}
                >
                    {open ? <KeyboardArrowRightIcon /> : <KeyboardArrowLeftIcon />}
                    <label className={classes.legendTitleMobile}>Legend</label>
                </div>
                {open ? (
                    <React.Fragment>
                        <PieLegendDisplayOptions totals={totals} setTotals={setTotals} />
                        <div>
                            {data.map((el, ind) => (
                                <div
                                    key={el.id}
                                    className={common.legendItem}
                                    style={{ background: `#${el.color}` }}
                                    onClick={() => setSelected(el)}
                                >
                                    <label className={common.label}>
                                        {el['category_name']
                                            ? el['category_name']
                                            : el['store_name']}
                                    </label>
                                    {totals ? (
                                        <label>{`$${getCurrencyFormat(el.amount)}`}</label>
                                    ) : (
                                        <label>{` ${Math.round(el.percent * 100)}%`}</label>
                                    )}
                                </div>
                            ))}
                        </div>
                    </React.Fragment>
                ) : null}
            </div>
        </div>
    );
}
