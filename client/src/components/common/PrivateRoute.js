import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const PrivateRoute = ({component: Component, auth, ...rest}) => (
    <Route 
        {...rest}
        render = {props => 
            // from auth state
            // if authenticated load component, else redirect to login
            auth.isAuthenticated === true ? (
                <Component {...props} />
            ) : (
                <Redirect to="/login" />
            )
        }
    />
);

PrivateRoute.propTypes = {
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
