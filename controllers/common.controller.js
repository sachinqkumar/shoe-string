var jwtDecode = require('jwt-decode');

const getJWTToken =  (req) => {
    var token = null;

    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        token = req.query.token;
    }
    return token;
}

const getDecodedToken = (token) => {
    var decodedToken = null;
    if (token) {
        decodedToken = jwtDecode(token);
    }
    return decodedToken;
}
const getDecodedTokenFromRequest = (req)=> {
    return getDecodedToken(getJWTToken(req));;
}
const getUserFromRequest = (req) => {
    var user = null;
    var decodedToken = getDecodedToken(getJWTToken(req));
    if (decodedToken) {
        user = decodedToken.sub;
    }
    return user;
}

exports.getJWTToken = getJWTToken;
exports.getDecodedToken = getDecodedToken;
exports.getDecodedTokenFromRequest = getDecodedTokenFromRequest;
exports.getUserFromRequest = getUserFromRequest;