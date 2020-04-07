const express = require("express");
const User = require("../models/user");
const {
  auth,
  newUserAuth
} = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");
const {
  sendWelcomeEmail,
  sendGoodByeEmail
} = require("../emails/account")


const router = new express.Router();

// USERS METHOD-------------------------------------------
//create new user
router.post("/users", newUserAuth, async (req, res) => {
  const user = new User(req.body);
  try {
    sendWelcomeEmail(user.email, user.name, user.verificationNumber)
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({
      user: user.getPublicProfile(),
      token,
    });
    console.log("User " + user.name + " created.");
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/users/verify", async (req, res) => {
  try {
    debugger
    user = await User.findOne({
      email: req.body.email
    })
    if (!user || user.verificationNumber != req.body.verificationNumber) {
      throw new Error()
    }
    user.verifiedAccount = true
    user.save()
    res.send({
      message: "Account verified"
    })
  } catch (error) {
    res.status(401).send({
      error: "Unable to verify."
    })
  }

})

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({
      user: user.getPublicProfile(),
      token,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

///get my info
router.get("/users/me", auth, async (req, res) => {
  res.send(req.user.getPublicProfile());
});

////log out
router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send({
      meesage: "Successfully logged out.",
    });
  } catch (error) {
    res.status(500).send();
  }
});

////log out ALL
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send("Successfully logged out from all devices.");
  } catch (error) {
    req.status(500).send();
  }
});

///update user
router.patch("/users/me", auth, async (req, res) => {
  debugger;
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send("Invalid updates.");
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    if (req.body["password"]) {
      req.user.tokens = [];
      await req.user.save();
      res.send({
        message: "Password changed correctly, please Log in with the new password.",
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
    const usernameDeleted = req.user.name;
    await req.user.remove();
    sendGoodByeEmail(req.user.email, req.user.name)
    res.send({
      message: usernameDeleted.toString() + " deleted.",
    });
    console.log("user " + usernameDeleted + " deleted");
  } catch (error) {
    res.status(500).send();
  }
});

const upload = multer({
  limits: {
    fileSize: 2000000,
  },
  fileFilter(req, file, cb) {
    if (file.originalname.match(/\.(jpg|jpeg|bmp|png)$/) == undefined) {
      return cb(new Error("please upload a valid image: jpg|jpeg|bmp|png"));
    }
    // if (file.size > 2000000) {
    //   return cb(new Error("please upload a smaller image (< 2mb)"))
    // }
    cb(undefined, true);
  },
});

///add avatar
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
      const buffer = await sharp(req.file.buffer)
        .resize({
          width: 250,
          height: 250
        })
        .png()
        .toBuffer();
      req.user.avatar = buffer;
      await req.user.save();
      res.send({
        message: "Avatar updated successfully",
      });
    },
    (error, req, res, next) => {
      res.status(400).send({
        error: error.message,
      });
    }
);

///delete avatar
router.delete("/users/me/avatar", auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send("Avatar successfully deleted.");
  } catch (error) {
    res.status(500).send();
  }
});

/// get avatar
router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send("Image not found.");
  }
});

module.exports = router;