const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./../models/assignment.model').PetOwner;

exports.authenticateUser = (req, res, next) => {

    if (!req.body.password || !req.body.username) {
        return next({ status: 400, message: ERRORS.MISSING_REQUIRED_INPUT });
    }
    //Inable case insensitive lookup on email.
    let username = '^' + sanitize(req.body.username).trim() + '$';
    let promise = User.findOne({ username: { '$regex': username, $options: 'i' } }).exec();

    promise.then(function (user) {
        //User exists and is active
        if (user && bcrypt.compareSync(req.body.password, user.password)) {

            let userFound = _.omit(req.body, ['password']);
            userFound.name = user.name;
            userFound.id = user._id;
            userFound.email = user.email.toLowerCase();
            userFound.subscription = user.subscription;
            userFound.mobile = user.mobile;
            
            userFound.token = jwt.sign({ sub: user._id, permissions: user.subscription}, config.secret, { expiresIn: 3600 });
            
           
            return  res.send(userFound);


        } else {
            // authentication failed
            return next({ status: 400, message: "Invalid username or password" });
        }

    }).catch(function (err) {
        return next(err);
    });

}
