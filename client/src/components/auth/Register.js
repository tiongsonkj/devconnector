import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom'; // helps us redirect to next page
import { connect } from 'react-redux'; // connecting redux to this component
import { registerUser } from '../../actions/authActions'; // import action we want to use
import TextFieldGroup from '../common/TextFieldGroup';

class Register extends Component {
    constructor() {
        super();
        this.state = {
            name: '',
            email: '',
            password: '',
            password2: '',
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

    // runs when component receives new properties
    componentWillReceiveProps(nextProps) { 
        //checking for errors in errorsProp
        // errors will now be in state
        if(nextProps.errors) {
            this.setState({errors: nextProps.errors.errors}) 
            //.errors.errors because for some reason the errors object is within another set of brackets
        } 
    }

    // need to create a change event so that we can type in the input fields below
    // if we were to try and type with no onChange, it will not allow us to type in fields in the app
    // we need to place this function into the input fields below
    // e stands for event
    onChange(e) {
        //this is how we get the value of what the user types in the name field, we set the state to what the user typed
        this.setState({[e.target.name]: e.target.value}); 
    }

    onSubmit(e) {
        e.preventDefault();

        // field that will send to backend.
        // this matches my validation/register.js page
        // make sure fields match and spelled correctly
        const newUser = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2
        }

        // any action we bring in is called through props because its stored in props
        // allow us to use this.props.history to redirect within that action
        this.props.registerUser(newUser, this.props.history);

        // can check this object in console        
        console.log(newUser);
            
        // axios was here but we are bringing it to authActions
    }


    render() {
        //pulling errors out of the state and setting it to 'errors'
        // same as const errors = this.state.errors
        const { errors } = this.state; 
        console.log(errors);
        console.log(this.state);
        console.log(this.props);

        return (
            <div className="register">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                        <h1 className="display-4 text-center">Sign Up</h1>
                        <p className="lead text-center">Create your DevConnector account</p>
                        <form noValidate onSubmit={this.onSubmit}>
                            <TextFieldGroup
                                placeholder="Name"
                                name="name"
                                // type="", dont need this because its a text field, dont need text fields for types
                                value={this.state.name}
                                onChange={this.onChange}
                                error={errors.name}
                            />
                            <TextFieldGroup
                                placeholder="Email Address"
                                name="email"
                                type="email"
                                value={this.state.email}
                                onChange={this.onChange}
                                error={errors.email}
                                info="This site uses Gravatar so if you want a profile image, use a Gravatar email"
                            />
                            <TextFieldGroup
                                placeholder="Password"
                                name="password"
                                type="password"
                                value={this.state.password}
                                onChange={this.onChange}
                                error={errors.password}
                            />
                            <TextFieldGroup
                                placeholder="Confirm Password"
                                name="password2"
                                type="password"
                                value={this.state.password2}
                                onChange={this.onChange}
                                error={errors.password2}
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

// include PropTypes -> any properties you have in your component you should map to prop types.
Register.propTypes = {
    registerUser: PropTypes.func.isRequired, //registerUser is a function
    auth: PropTypes.object.isRequired, //auth is an object
    errors: PropTypes.object.isRequired
}

// .auth comes from rootReducer
// auth is the name, we couldve given it any name we wanted
const mapStateToProps = (state) => ({
    auth: state.auth, //putting auth state inside a property 'auth'
    errors: state.errors //if there are any errors it will add to this
});

// second parameter is an object where we can map our actions
// withRouter will allow us to go to the next page after user registers
export default connect(mapStateToProps, { registerUser })(withRouter(Register)); 