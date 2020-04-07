const mongoose = require("mongoose");
const validator = require("validator");
const bcript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("./task");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      trim: true,
      default: 0,
      validate(age) {
        if (age !== null && age < 0) {
          throw new Error("age must be a positive number");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate(pw) {
        ///regex
        const upper = pw.match(/[A-Z]/);
        const lower = pw.match(/[a-z]/);
        const num = pw.match(/[0-9]/);

        if (
          validator.isLength(pw, {
            min: 0,
            max: 5,
          })
        ) {
          throw new Error("Password length must be greater than 5.");
        } else if (validator.contains(pw.toLowerCase(), "password")) {
          throw new Error('Password must not contain the word "password".');
        } else if (num == null) {
          throw new Error("Password must contain at least one number.");
        } else if (upper == null) {
          throw new Error("Password must contain at least one upper letter.");
        } else if (lower == null) {
          throw new Error("Password must contain at least one lower letter.");
        }
      },
    },
    verificationNumber: {
      type: Number,
    },
    verifiedAccount: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      // unique: true, //auth via newUserAuth
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email.");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    avatar: {
      type: Buffer,
    },
    tasksCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

////relation between user and his/her tasks
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner",
});

userSchema.methods.getPublicProfile = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.__v;
  delete userObject._id;
  delete userObject.avatar;
  delete userObject.verifiedAccount;
  delete userObject.verificationNumber;
  // delete userObject.createdAt
  // delete userObject.updatedAt
  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    {
      _id: user._id.toString(),
    },
    process.env.JWT_SECRET
  );
  user.tokens = user.tokens.concat({
    token,
  });

  ///mantaining tokens.length < 6
  if (user.tokens.length > 5) {
    user.tokens.shift();
  }

  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({
    email: email,
  });
  if (!user) {
    throw new Error("Unable to log in.");
  }

  const isMatch = await bcript.compare(password, user.password);
  if (!isMatch) {
    console.log("todo mal");
    throw new Error("Unable to log in.");
  }

  return user;
};

/// hash user password
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcript.hash(user.password, 8);
    console.log("Password hashed.");
  }
  next();
});

///delete user tasks when user is deleted
userSchema.pre("remove", async function (next) {
  const user = this;
  await Task.deleteMany({
    owner: user._id,
  });

  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
