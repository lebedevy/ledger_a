import { combineReducers } from 'redux';
import date from './date';
import drawer from './drawer';
import user from './user';

export default combineReducers({ date, drawer, user });
