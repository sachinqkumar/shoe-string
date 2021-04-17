
const { PetOwner, Pet } = require('./../models/assignment.model');
const sanitize = require('mongo-sanitize');
const subscription = ['Premium', 'Free'];
const commonCtrl = require('./common.controller');

exports.storePetLocation = (req, res, next) => {

    let request = sanitize(req.body);

    if (!request || !request.transmitterId || !request.ownerId || !request.loc.coordinates
        || !request.loc.type || !request.loc.coordinates.length !== 2) {
        return next({ status: 400, message: "Missing required inputs" });
    }

    Pet.findOne({ transmitterId: request.transmitterId, ownerId: request.ownerId },
        (err, petFindResponse) => {
            if (err) {
                return next(err);
            }
            if (!petFindResponse) {
                var petIn = new Pet(request);
                petIn.save(function (err, petSaveResponse) {
                    if (err) {
                        return next(err);
                    }
                    return res.send({ message: "Location Created Successfully." });
                });
            } else {
                petFindResponse.loc = request.loc;
                petFindResponse.save((err, petUpdateResponse) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    return res.send({ message: "Location Updated Successfully." });
                });

            }
        }
    );

}

exports.getPetLocationHistory = (req, res, next) => {
    let decodedToken = commCtrl.getDecodedTokenFromRequest(req);
    let subscription = decodedToken.permissions;

    let params = req.params;
    let petId = sanitize(params.petId);

    //Based on subscription, fetch the Pet History
    let today = moment().startOf('day');
    if ('Free' === subscription) {
        start = moment().startOf('day');
        end = moment(start).add(1, 'days');
    } else if ('Premium' === subscription) {
        start = moment(today).subtract(29, 'days');
        end = moment(today).add(1, 'days');
    }

    Pet.findAllHistoryForPetById(petId, start, end, function (err, results) {
        if (err) {
            return next(err);
        } else {
            return res.send(results);
        }
    })
}


exports.searchNearByPets = (req, res, next) => {
    let params = sanitize(req.body);

    let petId = sanitize(params.petId);
    let maxDistance = Number(params.maxDistance);

    //Find the incoming pet and then use geoNear to find all Pets nearby.
    Pet.findOne({ _id: petId }, (err, petresponse) => {
        if (err) {
            return next(err);
        } else if (!petresponse) {
            return next({ status: 400, message: "Bad Request" });
        } else {
            Pet.aggregate(
                [
                    {
                        "$geoNear": {
                            "near": petresponse.loc,
                            "maxDistance": maxDistance * 1000,
                            "distanceField": "dist.calculated",
                            "distanceField": "distance",
                            "spherical": true,
                        }
                    }
                ],
                function (err, results) {
                    User.populate(
                        results, { path: 'ownerId', model: 'PetOwner', select: 'name email mobile' },
                        function (err, nearByOwners) {
                            if (err) {
                                return next(err);
                            }
                            return res.send(nearByOwners);
                        });
                }
            )
        }
    });
}