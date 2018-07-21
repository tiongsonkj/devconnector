const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateEducationInput(data) {
    let errors = {};

    // this makes sure the title and company field(required) are filled
    data.school = !isEmpty(data.school) ? data.school : '';
    data.degree = !isEmpty(data.degree) ? data.degree : '';
    data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
   // data.from = !isEmpty(data.from) ? data.from : '';      //took out from date for now      
                

    // making use of validator!
    // really only validate the fields that are required
    if(Validator.isEmpty(data.school)) {
        errors.school = 'School field is required';
    }
    if(Validator.isEmpty(data.degree)) {
        errors.degree = 'Degree field is required';
    }
    if(Validator.isEmpty(data.fieldofstudy)) {
        errors.fieldofstudy = 'Field of Study field is required';
    }
    // if(Validator.isEmpty(data.from)) {
    //     errors.from = 'From date field is required';
    // }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};