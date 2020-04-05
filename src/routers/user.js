const express = require("express");
const User = require("../models/user");
const parsedId = require("../utils/utils");
const auth = require("../middleware/auth")
const multer = require("multer")

const router = new express.Router();

// USERS METHOD-------------------------------------------
//create new user
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthToken()
    res.status(201).send({
      user: user.getPublicProfile(),
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
      user: user.getPublicProfile(),
      token
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

///get my info
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user.getPublicProfile())
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


///update user
router.patch("/users/me", auth, async (req, res) => {
  debugger
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send("Invalid updates.");
  }

  try {
    updates.forEach(update => (req.user[update] = req.body[update]));
    if (req.body["password"]) {
      req.user.tokens = []
      await req.user.save();
      res.send({
        message: "Password changed correctly, please Log in with the new password."
      });
    }
    await req.user.save();
    res.send(req.user.getPublicProfile());
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    const usernameDeleted = req.user.name
    await req.user.remove()
    res.send({
      message: usernameDeleted.toString() + " deleted."
    });
    console.log("user " + usernameDeleted + " deleted");
  } catch (error) {
    res.status(500).send();
  }
});

const upload = multer({
  dest: "avatars"
})

router.post("/users/me/avatar", upload.single("avatar"), (req, res) => {
  res.send()
})


module.exports = router;