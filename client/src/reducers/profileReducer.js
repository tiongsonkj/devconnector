import { GET_PROFILE, GET_PROFILES, PROFILE_LOADING, CLEAR_CURRENT_PROFILE } from '../actions/types';

const initialState = {
    profile: null,
    profiles: null, //array of profiles
    loading: false //set this to false because we will be fetching the profiles. if still fetching we can show a loader
}

// basic setup
export default function(state = initialState, action) {
    switch(action.type) {
        case PROFILE_LOADING:
            return {
                ...state,
                loading: true
            };
        case GET_PROFILE:
            return {
                ...state,
                profile: action.payload,
                loading: false
            };
        case GET_PROFILES:
            return {
                ...state,
                profiles: action.payload,
                loading: false
            };
        case CLEAR_CURRENT_PROFILE:
            return {
                ...state,
                profile: null,
            };
        default: 
            return state;
    }
};