const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");

// require()

////setup
const sleep = (ms) => new Promise((response) => setTimeout(response, ms));
const preVerifiedUserId = new mongoose.Types.ObjectId();
const preVerifiedUser = {
    _id: preVerifiedUserId,
    name: "Pre Verified User",
    email: "preVerifiedUser@falsgmail.com",
    password: "1234aA",
    tokens: [{
        token: jwt.sign({
                _id: preVerifiedUserId,
            },
            process.env.JWT_SECRET
        ),
    }, ],
};

const preVerifiedUserTwoId = new mongoose.Types.ObjectId();
const preVerifiedUserTwo = {
    _id: preVerifiedUserTwoId,
    name: "Pre Verified User Two",
    email: "preVerifiedUserTwo@falsgmail.com",
    password: "4321bB",
    tokens: [{
        token: jwt.sign({
                _id: preVerifiedUserTwoId,
            },
            process.env.JWT_SECRET
        ),
    }, ],
};

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "test activity of preVerifiedUser",
    completed: false,
    owner: preVerifiedUserId
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: "test activity of preVerifiedUserTwo",
    completed: true,
    owner: preVerifiedUserTwoId
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: "test activity of preVerifiedUserTwo 2",
    completed: true,
    owner: preVerifiedUserTwoId
}

const setupDataBase = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    const user = await new User(preVerifiedUser);
    const userTwo = await new User(preVerifiedUserTwo);
    user.verifiedAccount = true;
    userTwo.verifiedAccount = true;
    await user.save();
    await userTwo.save();
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    preVerifiedUserId,
    preVerifiedUser,
    setupDataBase,
    sleep,
    taskTwo

}