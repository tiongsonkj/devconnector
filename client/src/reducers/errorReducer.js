import { GET_ERRORS, CLEAR_ERRORS } from '../actions/types';

// initial state for reducer
const initialState = {}; //nothing in here because we want the errors object in initial state

// every reducer is exporting a function
// takes in the initial state we created
// action is an object that includes a type
// we test with switches, and we test cases
export default function(state = initialState, action) {
    switch(action.type) {
        case GET_ERRORS:
            //send payload which includes err.response.data (dispatch from authActions)
            return action.payload
        case CLEAR_ERRORS:
            return {}; //return empty object to clear the errors
        default:
            return state;
    }
};