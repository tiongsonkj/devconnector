import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const TextFieldGroup = ({
    // these are possible properties we are bringin in
    name,
    placeholder,
    value,
    label,
    error,
    info,
    type,
    onChange,
    disabled
}) => {
    return (
        <div className="form-group">
            <input 
                type={type} 
                className={classnames('form-control form-control-lg', {
                    'is-invalid': error
                })} 
                placeholder={placeholder} 
                name={name}
                value={value}
                onChange={onChange}
                //required //this is html required checkin. but we will not need it because we will have our own checkin
                disabled={disabled}
            />
            {info && <small className="form-text text-muted">{info}</small>}
    
            {/* never seen this before but from what it does (he said it was javascript syntax), if theres errors.name, then in parenthesis include that div. This is what gives me the small red feedback of the error */}
            {error && (
                <div className="invalid-feedback">{error}</div>
            )}
        </div>
    )
}

// adding in prop types
TextFieldGroup.propTypes = {
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    info: PropTypes.string,
    error: PropTypes.string,
    type: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.string
}

// default prop if nothing is passed in
TextFieldGroup.defaultProps = {
    type: 'text'
}

export default TextFieldGroup;