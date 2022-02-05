import { createStore, combineReducers } from 'redux';
import tokenReducer from '../reducers/reducers';
const rootReducer = combineReducers(
    { 
        auth: tokenReducer 
    }
);

const configureStore = () => {
    return createStore(rootReducer);
}

export default configureStore;