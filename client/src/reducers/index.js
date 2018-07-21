// root reducer, we bring in our other reducers in here.
import { combineReducers } from 'redux'; // combineReducers is part of redux
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import profileReducer from './profileReducer';
import postReducer from './postReducer';

export default combineReducers({
    auth: authReducer,
    errors: errorReducer,
    profile: profileReducer,
    post: postReducer
});