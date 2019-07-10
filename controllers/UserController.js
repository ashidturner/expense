/*jshint esversion: 8 */
const User = require('../models/user');
const Category = require('../models/category');
const fs = require('fs');
const authService = require('../service/authService');
const passport = require('passport');

const create = async function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    const body = req.body;


    if (!body.unique_key && !body.email && !body.phone) {
        return ReE(res, 'Please enter an email or phone number to register.', 400);
    } else if (!body.password) {
        return ReE(res, 'Please enter a password to register.', 400);
    } else {
        let err, user;

        [err, user] = await to(authService.createUser(body));
        console.log('in cntrller user is ', user);
        if (err) return ReE(res, err, 422);
        return ReS(res, { message: 'Successfully created new user.', user: user.toJSON(), token: user.generateJWT() }, 201);
    }
};
module.exports.create = create;



const login = function (req, res, next) {
    const { body: { user } } = req;

    if (!user.email) {
        return ReE(res, 'email is required', 422)
    }

    if (!user.password) {
        return ReE(res, 'password is required', 422)
    }

    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
        if (err) {
            return next(err);
        }

        if (passportUser) {
            const user = passportUser;
            user.token = passportUser.generateJWT();

            return ReS(res,user.toAuthJSON(),200);
        }

        return ReE(res,'Bad request',400);
    })(req, res, next);
};
module.exports.login = login;

//not being used as I changed the design and took the category separate from user
// const getLastAddedCategoryByUser = async function(userId){
   
//     const aggregateQuery = [{
//         "$match": {
//             "id": userId
//         }
//     }, 
//     {
//         "$unwind": "$category"
//     },
//      {
//         "$sort": {
//             "category.id": -1
//         }
//     }, {
        
//         "$limit":1
//     },
//     {
//         "$group": {
//             "category": {
//                 "$push": "$category"
//             },
//             "_id": 1
//         }
//     }, {
//         "$project": {
//             "_id": 0,
//             "category": 1
//         }
//     }];
//     [err,user] = await to(User.aggregate(aggregateQuery));
//     if(err) return [err,null];

//     return [ null, user[0].category ];
// };


/**
 * Creates category  
 *
 * @param req
 * @param res
 * @body userId
 * @body categoryName
 * @returns {Promise<*>}
 */
const addCategory = async function(req,res){
    
    let  body  = req.body;
    let  userId = body.userId;
    let categoryName = body.categoryName;
    // [ err, category ] = await getLastAddedCategoryByUser(userId);
    [ err, user ] = await to(User.findOne({"id":userId}));
    console.log(user);
   
    if(err) return ReE(res,{errorDescription:"Access not permitted for this user"}, 403);

    let category = new Category();
    category.name = categoryName;
    category.user = user;
    [err,user] = await to(category.save());
   
    if(err) {
        console.error(err)
        return ReE(res, {errorDescription: "Unable to add category"}, 500);
    }
    return ReS(res,{successObject:" New category added"},201);
};
module.exports.addCategory = addCategory;