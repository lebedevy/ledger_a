import { createStore } from 'redux';
import rootReducer from './reducers';
import Cookies from 'js-cookie';
import { devToolsEnhancer } from 'redux-devtools-extension';

const token = Cookies.get('jwt');
const user = parseJwt(token);
console.info('Initializing store...');
export default createStore(rootReducer, { user }, devToolsEnhancer());

function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
}
