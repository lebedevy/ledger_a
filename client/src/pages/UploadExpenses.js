import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
    container: {},
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
                border: '1px solid #00000020',
            },
        },
    },
});

export default function UploadExpenses() {
    const classes = useStyles();
    const [expenses, setExpenses] = useState(null);

    async function handleUpload(event) {
        // Get FileList object from the input element
        const { files } = event.target;
        console.log(files);
        // .item(index) gets the file stored at given index in the FileList obj
        const file = files.item(0);
        console.log(file);
        const contents = await file.text();
        // https://developer.mozilla.org/en-US/docs/Web/API/File
        console.log(contents);
        const rows = contents.split('\n');
        console.log(rows);
        const expenses = [];
        for (let row in rows) {
            expenses.push(rows[row].split(','));
        }
        console.log(expenses);
        setExpenses(expenses);
    }

    return (
        <div>
            <input type="file" onChange={handleUpload} accept={'.csv'} />

            {expenses && (
                <table className={classes.table}>
                    <tbody className={classes.body}>
                        {expenses.map(row => (
                            <tr>
                                {row.map(item => (
                                    <td>{item}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

function ColumnName() {
    return (
        <select>
            <option>Amount</option>
            <option>Store</option>
            <option>Category</option>
            <option>Date</option>
        </select>
    );
}
