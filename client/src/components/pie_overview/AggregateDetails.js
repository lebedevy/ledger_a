import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';

import SummaryDetailsButton from '../overview/SummaryDetailsButton';
import ExpenseSummary from '../ExpenseSummary';
import { getCurrencyFormat } from '../../utility/utility';

const detailsUseStyles = makeStyles({
    selectedTitle: {
        display: 'flex',
        alignItems: 'center',
        // justifyContent: 'space-between',
        paddingBottom: '10px',
        '& h2': {
            wordBreak: 'break-all',
            '& label': {
                fontSize: '0.9em',
                fontStyle: 'italic',
                verticalAlign: 'center',
            },
        },
        '& div': {
            minHeight: '32px',
            minWidth: '32px',
            borderRadius: '50%',
        },
    },
});

export default function AggregateDetails({ selected, type }) {
    const classes = detailsUseStyles();
    const [total, setTotal] = useState(0);
    const [expanded, setExpanded] = useState(false);

    console.log(selected);

    useEffect(() => {
        let total = 0;
        selected.data.forEach(el => (total += el.amount));
        setTotal(total);
    }, [selected]);

    return (
        <React.Fragment>
            <div className={classes.selectedTitle}>
                <div style={{ background: `#${selected.el.color}` }} />
                <h2>
                    Details:
                    <label>{`${
                        selected.el[type === 'cat' ? 'category_name' : 'store_name']
                    }`}</label>
                </h2>
            </div>
            <label>{`Total ${type === 'cat' ? 'category' : 'store'} expense: $${getCurrencyFormat(
                total
            )}`}</label>
            <SummaryDetailsButton expanded={expanded} setExpanded={setExpanded} />
            {expanded
                ? selected.data.map(el => (
                      <ExpenseSummary
                          el={el}
                          exclude={{ [type === 'cat' ? 'category' : 'store']: 1 }}
                      />
                  ))
                : null}
        </React.Fragment>
    );
}
