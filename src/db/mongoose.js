const mongoose = require("mongoose");
const validator = require("validator");

mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api", {
  useNewUrlParser: true,
  useCreateIndex: true
});

const User = mongoose.model("User", {
  name: { type: String, required: true, trim: true },
  age: { type: Number, trim: true },
  password: {
    type: String,
    required: true,
    trim: true,
    validate(pw) {
      ///regex
      const upper = pw.match(/[A-Z]/);
      const lower = pw.match(/[a-z]/);
      const num = pw.match(/[0-9]/);

      if (validator.isLength(pw, { min: 0, max: 5 })) {
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
    }
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email.");
      }
    }
  }
});

const Task = mongoose.model("Task", {
  description: { type: String, required: true, trim: true },
  completed: {
    type: Boolean,
    default: false,
    validate(value) {
      if (value < 0) {
        throw new Error("age must be a positive number");
      }
    }
  }
});

const me = new User({
  name: "forro ",
  age: "30 ",
  password: "dsddfgsdfFf3",
  email: "gon@SpeechGrammarList.com"
});

me.save()
  .then(me => {
    console.log(me);
  })
  .catch(error => {
    console.log(error.message);
  });

// const task = new Task({ description: "jogging", completed: true });

// task.save();
