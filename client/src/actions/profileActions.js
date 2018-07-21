import axios from 'axios';

import { 
    GET_PROFILE, 
    GET_PROFILES,
    PROFILE_LOADING, 
    CLEAR_CURRENT_PROFILE, 
    GET_ERRORS, 
    SET_CURRENT_USER 
} from './types';

// get current profile
export const getCurrentProfile = () => dispatch => {
    dispatch(setProfileLoading());

    axios.get('/api/profile')
        .then(res => 
            dispatch({
                type: GET_PROFILE,
                payload: res.data
            })
        )
        .catch(err => 
            dispatch({
                type: GET_PROFILE,
                payload: {}
            })
        )
};

// get profile by handle
export const getProfileByHandle = (handle) => dispatch => {
    dispatch(setProfileLoading());

    axios.get(`/api/profile/handle/${handle}`)
        .then(res => 
            dispatch({
                type: GET_PROFILE,
                payload: res.data
            })
        )
        .catch(err => 
            dispatch({
                type: GET_PROFILE,
                payload: null // check to see if issue exists so you'll see if payload is null
            })
        )
};

// Create profile
export const createProfile = (profileData, history) => dispatch => {
    axios.post('/api/profile', profileData)
        .then(res => history.push('/dashboard'))
        .catch(err => 
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        );
};

// add experience
export const addExperience = (expData, history) => dispatch => {
    axios.post('/api/profile/experience/', expData)
        .then(res => history.push('/dashboard'))
        .catch(err => 
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        ); 
};

// add education
export const addEducation = (eduData, history) => dispatch => {
    axios.post('/api/profile/education/', eduData)
        .then(res => history.push('/dashboard'))
        .catch(err => 
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        ); 
};

// delete experience
export const deleteExperience = (id) => dispatch => {
    axios.delete(`/api/profile/experience/${id}`)
        .then(res => 
            dispatch({
                type: GET_PROFILE,
                payload: res.data //when we delete experience we get profile back without that deleted experience
            })
        )
        .catch(err => 
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        ); 
};

// delete education
export const deleteEducation = (id) => dispatch => {
    axios.delete(`/api/profile/education/${id}`)
        .then(res => 
            dispatch({
                type: GET_PROFILE,
                payload: res.data //when we delete experience we get profile back without that deleted experience
            })
        )
        .catch(err => 
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        ); 
};

// get all profiles
export const getProfiles = () => dispatch => {
    // this is to get the spinner
    dispatch(setProfileLoading());
    axios.get('/api/profile/all') 
        .then(res => 
            dispatch({
                type: GET_PROFILES,
                payload: res.data
            })
        )
        .catch(err => 
            dispatch({
                type: GET_PROFILES,
                payload: null // keep profiles state as null in reducer
            })
        );
};

// Delete account & profile
export const deleteAccount = () => dispatch => {
    if(window.confirm('Are you sure? This can NOT be undone!')) {
        axios.delete('/api/profile')
            .then(res => 
                dispatch({
                    type: SET_CURRENT_USER,
                    payload: {} // sets auth user to nothing
                })
            ).catch(err =>
                dispatch({
                    type: GET_ERRORS,
                    payload: err.response.data
                })
            );
    }
};

// Profile loading. This lets reducer know its loading
export const setProfileLoading = () => {
    return {
        type: PROFILE_LOADING
    }
};

// Clear profile
export const clearCurrentProfile = () => {
    return {
        type: CLEAR_CURRENT_PROFILE
    }
};