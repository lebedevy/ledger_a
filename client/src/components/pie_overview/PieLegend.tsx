import React, { useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/styles';

import MobileLegend from './legend/MobileLegend';
import { getCurrencyFormat } from '../../utility/utility';
import PieLegendDisplayOptions from './legend/PieLegendDisplayOptions';

const useStyles = makeStyles({
    legend: {
        background: '#E7E5E8',
        display: 'flex',
        margin: '0 10px',
        flexDirection: 'column',
        width: '200px',
        maxWidth: '200px',
        overflow: 'auto',
        padding: '0 5px',
        border: 'solid 1px #00000020',
        borderRadius: '5px',
        height: '80vw',
        maxHeight: '500px',
        '& h2': {
            textAlign: 'center',
            margin: '20px 0 5px 0',
        },
    },
    legendItem: {
        padding: '5px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        // border: '#ffffff99 1px solid',
    },
    label: {
        paddingRight: '5px',
        wordBreak: 'break-all',
    },
});

function CategoryOverview({ open, setLegendOpen, width, data, setSelected }) {
    const classes = useStyles();
    const [totals, setTotals] = useState(false);

    return (
        <React.Fragment>
            {width <= 700 ? (
                <MobileLegend
                    open={open}
                    setLegendOpen={setLegendOpen}
                    data={data}
                    common={classes}
                    setSelected={setSelected}
                />
            ) : (
                // Desktop/widescreen legend
                <div className={classes.legend}>
                    <h2>Legend</h2>
                    <PieLegendDisplayOptions totals={totals} setTotals={setTotals} />
                    {data.map((el, ind) => (
                        <div
                            key={el.id}
                            className={classes.legendItem}
                            style={{ background: `#${el.color}` }}
                            onClick={() => setSelected(el)}
                        >
                            <label className={classes.label}>
                                {el['category_name'] ? el['category_name'] : el['store_name']}
                            </label>
                            {totals ? (
                                <label>{`$${getCurrencyFormat(el.amount)}`}</label>
                            ) : (
                                <label>{` ${Math.round(el.percent * 100)}%`}</label>
                            )}
                        </div>
                    ))}
                    {!data || data.length === 0 ? (
                        <label style={{ textAlign: 'center' }}>No expenses for the period</label>
                    ) : null}
                </div>
            )}
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    const { date } = state;
    const { start, end } = date.period;
    return { start, end };
};

export default connect(mapStateToProps)(CategoryOverview);
