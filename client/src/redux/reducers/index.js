import { combineReducers } from 'redux';
import date from './date';
import drawer from './drawer';
import user from './user';
import screen from './screen';
import screenSelect from './screenSelect';
import aggregateExpenses from './aggregateData';
import templateLists from './templateLists';

export default combineReducers({
    date,
    drawer,
    user,
    screen,
    screenSelect,
    aggregateExpenses,
    templateLists,
});
