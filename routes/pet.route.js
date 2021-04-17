module.exports = (app) => {
  const premiumRole =  [['Premium']];
  const commonRole = [['Premium'], ['Free']];
  const guard = require("express-jwt-permissions")();
  const petCtrl = require('./../controllers/pet.controller');

  // Create a new Pet
  app.post("/api/v1/pet/location", guard.check(commonRole), petCtrl.storePetLocation);

  // find Pet by name
  app.get('/api/v1/pet/:petId', guard.check(commonRole), petCtrl.getPetLocationHistory);
  
  // retrieve owner details in 5 km radius. Only for premium owners
  app.post('/api/v1/pet/nearby/searchowner', guard.check(premiumRole), petCtrl.searchNearByPets);

}
