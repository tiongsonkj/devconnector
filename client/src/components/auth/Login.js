import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { loginUser } from '../../actions/authActions'; 
import TextFieldGroup from '../common/TextFieldGroup';

class Login extends Component {
    constructor() {
        super();

        this.state = {
            email: '',
            password: '',
            errors: {}
        };

        // so we can use 'this' in the function onChange
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidMount() {
        // if logged in
        if(this.props.auth.isAuthenticated) {
            this.props.history.push('/dashboard'); //send to dashboard
        }
    }

    componentWillReceiveProps(nextProps) {
        // test to see if isAuthenticated is true
        if(nextProps.auth.isAuthenticated) {
            this.props.history.push('/dashboard');
        }

        // console log the length of the nextProps.errors
        // storing the length as errorObjLength
        console.log(Object.keys(nextProps.errors).length);
        const errorObjLength = Object.keys(nextProps.errors).length;
        
        // for some odd reason, if the errors come through, they are set in an object
        // so...had to manipulate this real quick
        // if the length of the errors is 0. (theres nothing in nextProps.errors)
        // then set the errors state to that
        // else if length is not zero (there is an object in nextProps.errors)
        // set the error state to that object (errors object inside nextProps.errors)
        if(errorObjLength === 0) {
            this.setState({errors: nextProps.errors})
        } else {
            this.setState({errors: nextProps.errors.errors})
        }
    }

    onChange(e) {
        //this is how we get the value of what the user types in the name field, we set the state to what the user typed
        this.setState({[e.target.name]: e.target.value}); 
    }

    onSubmit(e) {
        e.preventDefault();

        // field that will send to backend.
        // this matches my validation/register.js page
        // make sure fields match and spelled correctly
        const userData = {
            email: this.state.email,
            password: this.state.password,
        }

        // can check this object in console        
        console.log(userData);

        // calling in action from authAction.js
        this.props.loginUser(userData);
    }

    render() {
        const { errors } = this.state;
        console.log(this.state);
        console.log(errors);

        return (
        <div className="login">
            <div className="container">
                <div className="row">
                    <div className="col-md-8 m-auto">
                    <h1 className="display-4 text-center">Log In</h1>
                    <p className="lead text-center">Sign in to your DevConnector account</p>
                    <form onSubmit={this.onSubmit}>
                        <TextFieldGroup
                            placeholder="Email Address"
                            name="email"
                            type="email"
                            value={this.state.email}
                            onChange={this.onChange}
                            error={errors.email}
                        />
                        <TextFieldGroup
                            placeholder="Password"
                            name="password"
                            type="password"
                            value={this.state.password}
                            onChange={this.onChange}
                            error={errors.password}
                        />
                        <input type="submit" className="btn btn-info btn-block mt-4" />
                    </form>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

// comments regarding this is similar to Register.js component
Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

// comments regarding this is similar to Register.js component
const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
})

export default connect(mapStateToProps, { loginUser })(withRouter(Login));