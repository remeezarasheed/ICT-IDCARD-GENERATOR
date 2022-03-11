function validation(values){
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if(!values.username){
        errors.username =" Username is required";
    }
    if(!values.email){
        errors.email = "Email is Required";
    }
    else if(!regex.test(values.email)){
        errors.email = "Email is Invalid";
    }
    if(!values.password){
        errors.password ="Password is Required";
    }
    else if(values.password.length <5){
        errors.password = "Password is too Short";
    }
    return errors;
}
export default validation;