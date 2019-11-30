import React, { Component } from 'react';
import { TextField, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const styles = theme => ({
    container: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#00000025',
    },
    form: {
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#00000025',
    },
});

class AddExpense extends Component {
    state = { amount: '', store: '', category: '' };
    // Add store look up
    // add category lookup
    // store/category popup if did not exist in db before

    addExpense(e) {
        e.preventDefault();
        const { amount, store, category } = this.state;
        console.log(amount, store, category);
    }

    updateField(field, e) {
        this.setState({ [field]: e.target.value });
    }

    render() {
        const { classes } = this.props;
        const { amount, store, category } = this.state;
        return (
            <div className={classes.container}>
                <h2>Add Expense</h2>
                <form className={classes.form} onSubmit={e => this.addExpense(e)}>
                    <TextField
                        placeholder="Amount"
                        value={amount}
                        onChange={e => this.updateField('amount', e)}
                    />
                    <TextField
                        placeholder="Store"
                        value={store}
                        onChange={e => this.updateField('store', e)}
                    />
                    <TextField
                        placeholder="Expense category"
                        value={category}
                        onChange={e => this.updateField('category', e)}
                    />
                    <Button type="submit">Add Expense</Button>
                </form>
            </div>
        );
    }
}

export default withStyles(styles)(AddExpense);
