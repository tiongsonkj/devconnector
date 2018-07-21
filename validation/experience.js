const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
    let errors = {};

    // this makes sure the title and company field(required) are filled
    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    // data.from = !isEmpty(data.from) ? data.from : '';      //took out from date for now      
                

    // making use of validator!
    // really only validate the fields that are required
    if(Validator.isEmpty(data.title)) {
        errors.title = 'Job title field is required';
    }
    if(Validator.isEmpty(data.company)) {
        errors.company = 'Company field is required';
    }
    // if(Validator.isEmpty(data.from)) {
    //     errors.from = 'From date field is required';
    // }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};