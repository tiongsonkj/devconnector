// dispatch = send off to a destination 
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import { GET_ERRORS, SET_CURRENT_USER } from './types';

// Register action
// putting dispatch function inside of registerUser function
export const registerUser = (userData, history) => dispatch => {
    // thunk middle ware comes in here
    
    // we use axios to post the data
    // posts to that route then passes in userData
    // this will then go hand in hand with our route that we created for users in routes/api/users
    axios.post('/api/users/register', userData)
        .then(res => history.push('/login')) //goes to login if register is successful
        //err.response.data is an actual errors object
        // now its in the state so we just have to put it in return field where it relates to that input
        .catch(err => {
            dispatch({ //able to do this because of redux-thunk. we brought this in above
                type: GET_ERRORS,
                payload: err.response.data
            }); //cant use this.setState within action
            
        }); 
};

// Login action - Get User Token (just like above action)
export const loginUser = (userData) => dispatch => {
    // '/login' is the route that gets the token
    // pass in userData
    axios.post('/api/users/login', userData)
        .then(res => {
            // save to localStorage
            const { token } = res.data;
            
            console.log(token);
            // set token to localStorage
            // setItem only gets a string, but token is already a string
            localStorage.setItem('jwtToken', token);

            // set token to Auth Header
            setAuthToken(token);

            // decode token to get user data
            // decoded is going to store the user data, issued at date, and expiration of token
            const decoded = jwt_decode(token);

            // set current user
            dispatch(setCurrentUser(decoded));
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            });
        })
}

// set logged in user
export const setCurrentUser = (decoded) => {
    // dispatch back to user
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}

// Log user out
export const logoutUser = () => dispatch => {
    // Remove token from localStorage
    localStorage.removeItem('jwtToken');

    // remove auth header for future requests
    setAuthToken(false);

    // set current user to {} which will set is Authenticated to false
    // can see this in redux dev tool
    // we pass in an empty object because it will set it back to its original state from authReducer.js
    dispatch(setCurrentUser({}));    
}