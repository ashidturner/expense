/*jshint esversion: 8 */

const User 			= require('./../models/user');
const validator     = require('validator');


const getUniqueKeyFromBody = function(body){// this is so they can send in 3 options unique_key, email, or phone and it will work
    let unique_key = body.unique_key;
    if(typeof unique_key==='undefined'){
        if(typeof body.email != 'undefined'){
            unique_key = body.email
        }else if(typeof body.phone != 'undefined'){
            unique_key = body.phone
        }else{
            unique_key = null;
        }
    }

    return unique_key;
}
module.exports.getUniqueKeyFromBody = getUniqueKeyFromBody;

const createUser = async function(userInfo){
    let unique_key, auth_info, err;
    let user = new User();
    auth_info={}
    auth_info.status='create';

    unique_key = getUniqueKeyFromBody(userInfo);
    if(!unique_key) TE('An email or phone number was not entered.');

    if(validator.isEmail(unique_key)){
        auth_info.method = 'email';
        userInfo.email = unique_key;
        let encrypt_password = user.generateHash(userInfo.password);
        userInfo.password = encrypt_password;
        [err, user] = await to(User.create(userInfo));
        console.log('user is ',user)
        if(err) { 
            console.log(JSON.stringify(err));
            TE('user already exists with that email');
        }

        return user;

    }else if(validator.isMobilePhone(unique_key, 'any')){//checks if only phone number was sent
        auth_info.method = 'phone';
        userInfo.mobileNumber = unique_key;


        [err, user] = await to(User.create(userInfo));
        if(err) TE('user already exists with that phone number');

        return user;
    }else{
        TE('A valid email or phone number was not entered.');
    }
}
module.exports.createUser = createUser;


