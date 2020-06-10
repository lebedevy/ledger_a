import { combineReducers } from 'redux';
import date from './date';
import user from './user';
import screen from './screen';
import screenSelect from './screenSelect';
import aggregateExpenses from './aggregateData';
import templateLists from './templateLists';
import editing from './editingCell';
import uploadExpenses from './uploadExpenses';

export default combineReducers({
    date,
    user,
    screen,
    screenSelect,
    aggregateExpenses,
    templateLists,
    editing,
    uploadExpenses,
});
