const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const mongooseHistory = require('./../modules/mongoose-history/mongoose-history');
const dataTables = require('./../modules/mongoose-datatables/index.js');
const uuid = require('uuid');

const PetOwnerSchema = mongoose.Schema({
    _id: { type: String, default: uuid.v4 },
    username: { type: String, unqiue: true, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, unique: true },
    mobile: { type: String, required: false },
    subscription: { type: String, enum: ['Premium', 'Free'], default: 'Free' },
    consent: { type: Boolean, enum: [true, false], default: false },
    last_updated_user: { type: String, required: true }
},
    {
        timestamps: true
    });


var PetSchema = mongoose.Schema({
    _id: { type: String, default: uuid.v4 },
    ownerId: { type: String, required: true },
    transmitterId: { type: String, unqiue: true, required: true },
    name: { type: String },
    loc: {
        type: { type: String },
        coordinates: [Number],
    }
}, {
    timestamps: true
});

PetSchema.pre('find', function (next) {
    this.populate({ path: 'ownerId', model: 'PetOwner', select: 'name email mobile' });
    next();
});
PetSchema.pre('findOne', function (next) {
    this.populate({ path: 'ownerId', model: 'PetOwner', select: 'name email mobile' });
    next();
});

PetSchema.index({ "loc": "2dsphere" });

const options = { customCollectionName: "h_pets" };
PetSchema.plugin(mongooseHistory, options);


module.exports = {
    PetOwner: mongoose.model('PetOwner', PetOwnerSchema),
    Pet: mongoose.model('Pet', PetSchema)
}