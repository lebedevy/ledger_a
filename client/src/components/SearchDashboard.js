import React, { useState, useEffect, Component } from 'react';
import { connect } from 'react-redux';
import { TextField, Select, MenuItem, FormControl } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/styles';
import clsx from 'clsx';
import { setPeriod } from '../redux/actions';

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        margin: '10px',
        '& label': {
            margin: '0 10px 0 5px',
            fontWeight: 'bold',
        },
        '& input': {
            // width: '130px',
        },
    },
    option: {
        display: 'flex',
        alignItems: 'center',
    },
    type: {
        minWidth: '90px',
    },
    order: {
        minWidth: '70px',
    },
    item: {
        cursor: 'pointer',
        padding: '10px',
    },
};

const options = {
    summary: ['Date', 'Amount', 'Store', 'Category'],
    aggregate: ['Amount', 'Name'],
};

class Dashboard extends Component {
    state = { sort: 0, order: this.props.type === 'aggregate' ? 1 : 0, type: this.props.type };

    componentDidMount() {
        this.setUpComponent();
    }

    componentDidUpdate(prevProps) {
        console.log(this.props);
        // Reset params on page change
        if (prevProps.history.location.pathname !== this.props.history.location.pathname) {
            this.setUpComponent();
        }
    }

    setUpComponent() {
        const [sortName, orderName] = this.getSort();
        const { type } = this.state;
        let sort = 0,
            order = type === 'aggregate' ? 1 : 0;
        if (sortName) {
            const capitalSort = sortName.slice(0, 1).toUpperCase() + sortName.slice(1);
            if (options[type].includes(capitalSort)) sort = options[type].indexOf(capitalSort);
        }
        if (orderName) order = orderName === 'asc' ? 0 : 1;
        console.log(sortName, orderName, sort, order, type);
        this.setState({ order, sort });
    }

    updateSort() {
        // console.log(sort, order, type);
        // console.log(history.location);
        console.log(this.getSort());
        const { sort, order, type } = this.state;
        const search = new URLSearchParams();
        search.set('sort', options[type][sort].toLowerCase());
        search.set('order', order === 1 ? 'desc' : 'asc');
        let path = this.props.history.location.pathname;
        if (path.slice(-1) === '/') path = this.props.history.location.pathname.slice(0, -1);
        this.props.history.push(path + '?' + search.toString());
    }

    getSort() {
        const search = new URLSearchParams(this.props.history.location.search);
        return [search.get('sort'), search.get('order')];
    }

    render() {
        const { classes } = this.props;
        const { type, sort, order } = this.state;
        return (
            <div className={classes.container}>
                <div className={classes.option}>
                    <label>Sort</label>
                    <Select
                        className={classes.type}
                        value={sort}
                        onChange={e => this.setState({ sort: e.target.value }, this.updateSort)}
                    >
                        {options[type].map((el, ind) => (
                            <MenuItem key={el} className={classes.item} value={ind}>
                                {el}
                            </MenuItem>
                        ))}
                    </Select>
                    <Select
                        className={classes.order}
                        value={order}
                        onChange={e => this.setState({ order: e.target.value }, this.updateSort)}
                    >
                        <MenuItem value={0}>ASC</MenuItem>
                        <MenuItem value={1}>DESC</MenuItem>
                    </Select>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { date } = state;
    const { start, end } = date.period;
    console.log(start, end);
    return { start, end };
};

export default connect(mapStateToProps, { setPeriod })(withStyles(styles)(Dashboard));
