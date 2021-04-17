const app = require("./../app");
const mongoose = require("mongoose");
const {PetOwner,Pet} = require("./../models/assignment.model");
const supertest = require("supertest");


afterEach((done) => {
    Pet.deleteMany({}, () => done());
    mongoose.model('h_pets').deleteMany({}, () => done());
});
afterAll((done) => {
    mongoose.connection.close();
    done();
})

describe('Post /api/v1/pet/location', () => {
    it('should create a new post', async () => {
        const res = await supertest(app)
            .post('/api/v1/pet/location')
            .send({
                "ownerId": "test123",
                "transmitterId": "test123",
                "name": "Test Pet",
                "loc": { 
                    "type": "Point",
                    "coordinates": [-73.97, 40.77]
                },
                "last_updated_user": "TestUser"
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message');

        const pet = await Pet.findOne({ ownerId: "test123" });
        expect(product.transmitterId).toBeTruthy();
        expect(product.ownerId).toBeTruthy();
    });
   
});

