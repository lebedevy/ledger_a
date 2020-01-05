import { combineReducers } from 'redux';
import date from './date';
import drawer from './drawer';
import user from './user';
import categories from './categories';
import stores from './stores';
import screen from './screen';
import screenSelect from './screenSelect';

export default combineReducers({ date, drawer, user, categories, stores, screen, screenSelect });
