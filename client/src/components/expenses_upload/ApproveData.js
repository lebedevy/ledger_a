import React from 'react';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    table: {
        maxWidth: '1200px',
        width: '100vw',
        margin: '0 auto',
    },
    body: {
        maxWidth: '1200px',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        '& tr': {
            flex: 1,
            display: 'flex',
            '& td': {
                flex: 1,
                // border: '1px solid #00000020',
                borderBottom: '1px solid #00000020',
            },
            '& th': {
                flex: 1,
                borderBottom: '1px solid #00000020',
            },
        },
    },
    border: {
        borderLeft: '1px solid #00000030',
    },
});

export default function ApproveData({ expenses }) {
    const classes = useStyles();
    return (
        <table className={classes.table}>
            <tbody className={classes.body}>
                <tr>
                    <th>Amount</th>
                    <th className={classes.border}>Store</th>
                    <th className={classes.border}>Category</th>
                    <th className={classes.border}>Date</th>
                </tr>
                {expenses &&
                    expenses.map(el => (
                        <tr>
                            <td>{el.amount}</td>
                            <td className={classes.border}>{el.store}</td>
                            <td className={classes.border}>{el.category}</td>
                            <td className={classes.border}>{el.date}</td>
                        </tr>
                    ))}
            </tbody>
        </table>
    );
}
