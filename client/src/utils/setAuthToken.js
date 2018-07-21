import axios from 'axios';

const setAuthToken = token => {
    if(token) {
        // apply to every request
        // think of Postman
        axios.defaults.headers.common['Authorization'] = token;
    } else { //if token not here
        // delete auth header
        delete axios.defaults.headers.common['Authorization'];
    }
};

export default setAuthToken;