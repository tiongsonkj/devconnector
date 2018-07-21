import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const SelectListGroup = ({
    // these are possible properties we are bringin in
    name,
    value,
    error,
    info,
    onChange,
    options
}) => {
    const selectOptions = options.map(option => (
        <option key={option.label} value={option.value}>
            {option.label}
        </option>
    ));
    return (
        <div className="form-group">
            <select 
                className={classnames('form-control form-control-lg', {
                    'is-invalid': error
                })} 
                name={name}
                value={value}
                onChange={onChange}
            >
                    {selectOptions}
            </select>
            
            {info && <small className="form-text text-muted">{info}</small>}
    
            {/* never seen this before but from what it does (he said it was javascript syntax), if theres errors.name, then in parenthesis include that div. This is what gives me the small red feedback of the error */}
            {error && (
                <div className="invalid-feedback">{error}</div>
            )}
        </div>
    )
}

// adding in prop types
SelectListGroup.propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    info: PropTypes.string,
    error: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired
};

export default SelectListGroup;