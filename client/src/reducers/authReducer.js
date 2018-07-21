import { SET_CURRENT_USER } from '../actions/types';
import isEmpty from '../validation/is-empty';

// initial state for reducer
const initialState = {
    isAuthenticated: false,
    user: {}
};

// every reducer is exporting a function
// takes in the initial state we created
// action is an object that includes a type
// we test with switches, and we test cases
export default function(state = initialState, action) {
    switch(action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                //check to see if the action.payload is not empty, if so then authenticate and fill with the user payload
                isAuthenticated: !isEmpty(action.payload), 
                user: action.payload
            };
        default:
            return state;
    }
};