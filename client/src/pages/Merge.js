import React, { useEffect, Component } from 'react';
import { makeStyles, withStyles } from '@material-ui/styles';
import { Select } from '@material-ui/core';
import SelectInput from '@material-ui/core/Select/SelectInput';

const styles = theme => ({
    container: {
        height: '100%',
        width: '100%',
        background: '#00000020',
    },
});

class Merge extends Component {
    state = { options: [], type: this.props.match.params.type };

    async componentDidMount() {
        const { type } = this.state;
        const res = await fetch('/users/expenses/manage/merge/' + type);
        const data = await res.json();
        console.log(data);
        // data.expenses.forEach(el => console.log(el));
        this.setState({ options: data });
    }

    render() {
        const { classes } = this.props;
        const { options } = this.state;
        return (
            <div className={classes.container}>
                <Select></Select>
                {/* <SelectInput></SelectInput> */}
            </div>
        );
    }
}

export default withStyles(styles)(Merge);
