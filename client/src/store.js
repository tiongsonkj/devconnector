import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

// everything we do is an action

const initialState = {};

const middleware = [thunk];
// [] empty array is the root reducer, which is now 'rootReducer'
// {} initialState object
// createStore and applyMiddleware is from Redux
// ... spread operator
const store = createStore(
    rootReducer, 
    initialState, 
    compose(
        applyMiddleware(...middleware),
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() //need this line to implement the chrome Redux extension
    )
);

export default store;