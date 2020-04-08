const request = require("supertest")
const app = require("../src/app")
const User = require("../src/models/user")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")

const preVerifiedUserId = new mongoose.Types.ObjectId()
const preVerifiedUser = {
    _id: preVerifiedUserId,
    name: "Pre Verified User",
    email: "preVerifiedUser@falsgmail.com",
    password: "1234aA",
    tokens: [{
        token: jwt.sign({
            _id: preVerifiedUserId
        }, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    console.log("=====before each=====")
    await User.deleteMany()
    const user = await new User(preVerifiedUser)
    user.verifiedAccount = true
    await user.save()
    console.log("=====Finished init mantainance=====")
})

test("should sign up a user", async () => {
    await request(app).post("/users").send({
        name: "john doe",
        email: "johndoe@falsgmail.com",
        password: "1234aA"
    }).expect(201)
})

// test("should log in using preVerifiedUser", async () => {
//     await request(app).post("/users/login").send({
//         email: "preVerifiedUser@falsgmail.com",
//         password: "1234aA"
//     }).expect(200)
// })

// test("should NOT log with a non existent user", async () => {
//     await request(app).post("/users/login").send({
//         email: "dontexists@falsgmail.com",
//         password: "1234aA"
//     }).expect(400)
// })

// test("should NOT log with an invalid password", async () => {
//     await request(app).post("/users/login").send({
//         email: "preVerifiedUser@falsgmail.com",
//         password: "1234daA"
//     }).expect(400)
// })