import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from './reducers';
import Cookies from 'js-cookie';
import { composeWithDevTools } from 'redux-devtools-extension';
import { fetchAggregateExpensesIfNeeded } from './actions';

const token = Cookies.get('jwt');
const user = parseJwt(token);
console.info('Initializing store...');
const store = createStore(
    rootReducer,
    { user, aggregateExpenses: {} },
    composeWithDevTools(applyMiddleware(thunkMiddleware))
);

// store.dispatch(fetchAggregateExpensesIfNeeded(['category']));
export default store;

function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}
