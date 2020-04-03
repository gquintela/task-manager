const express = require("express");
const User = require("../models/user");
const parsedId = require("../utils/utils");
const auth = require("../middleware/auth")

const router = new express.Router();

// USERS METHOD-------------------------------------------
//create new user
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken()
    res.send({
      user,
      token
    });
    res.status(201).send({
      user,
      token
    });
    console.log("User " + user.name + " created.");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );



    const token = await user.generateAuthToken()
    res.send({
      user,
      token
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

///get my info
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user)
});

////log out
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token
    });
    await req.user.save()
    res.send({
      meesage: "Successfully logged out."
    })
  } catch (error) {
    res.status(500).send()
  }
});


////log out ALL
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send("Successfully logged out from all devices.")
  } catch (error) {
    req.status(500).send()
  }
})


///get user by ID
router.get("/users/:id", async (req, res) => {
  let _parsedId = parsedId(req.params.id);
  if (_parsedId.length > 24) {
    return res.status(400).send("error, mismatch of id length");
  }
  try {
    const user = await User.findById(_parsedId);
    if (!user) {
      res.status(404).send();
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(500).send();
  }
});

///update user
router.patch("/users/:id", async (req, res) => {
  let _parsedId = parsedId(req.params.id);
  if (_parsedId.length > 24) {
    return res.status(400).send("error, mismatch of id length");
  }
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send("Invalid updates.");
  }

  try {
    const user = await User.findById(_parsedId);
    updates.forEach(update => (user[update] = req.body[update]));
    await user.save();

    if (!user) {
      return res.status(404).send("User not found.");
    }
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.delete("/users/:id", async (req, res) => {
  let _parsedId = parsedId(req.params.id);
  if (_parsedId.length > 24) {
    return res.status(400).send("error, mismatch of id length");
  }
  try {
    const user = await User.findByIdAndDelete(_parsedId);
    if (!user) {
      return res.status(404).send("No user found.");
    }
    res.send(user);
    console.log("user " + user.name + " deleted");
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;