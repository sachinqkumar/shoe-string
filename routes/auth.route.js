module.exports = (app) => {

  const userCtrl = require('./../controllers/user.controller');

  // Create a new Pet
  app.post("/api/v1/users/authenticate", userCtrl.authenticateUser);
}
