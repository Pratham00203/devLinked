const express = require("express");
const config = require("config");
// Getting the express router
const router = express.Router();
// Require the express validator which returns a object of two function and is stored in two functions check,validationResult
const { check, validationResult } = require("express-validator");
// Require the User model
const User = require("../../models/User");
// Require Gravatar package
const gravatar = require("gravatar");
// Require bcryptjs
const bcrypt = require("bcryptjs");
// Require JSONwebtoken
const jwt = require("jsonwebtoken");

// @route POST api/users
// @description TEST Route
// @access Public
router.post(
  "/",
  [
    // Validation of the fields:
    // Error if name is empty
    check("name", "Name is required").not().isEmpty(),
    // Error if email is not valid
    check("email", "Include valid Email").isEmail(),
    // Error if password is not minimum of 6 characters
    check("password", "Enter a password with 6 or more characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    // Errors array
    const errors = validationResult(req);
    // If the errors array is not empty set status 400:Bad request and give the error messages in json
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get the details of the user
    const { name, email, password } = req.body;

    try {
      // See if the User Exists:
      // Check if the user exists by email by using findOne
      let user = await User.findOne({ email });
      // If user exists then give the errors array a new message that user exists
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }
      // Get the user's gravatar:
      const avatar = gravatar.url(email, {
        // Gravatar image size
        s: "200",
        // Gravatar image doesn't have any objectionable image
        r: "pg",
        // default image if gravatar doesn't exist
        d: "mm",
      });

      // Creating a user
      user = new User({
        name,
        email,
        avatar,
        password,
      });
      // Encrypt the password:
      // Creating a salt
      const salt = await bcrypt.genSalt(10);
      // Hashing the salt with password
      user.password = await bcrypt.hash(password, salt);
      // Saving the user in the database
      await user.save();
      // Return jsonwebtoken:
      // Create a payload: actual data that we are using to make token
      const payload = {
        user: {
          id: user.id,
        },
      };
      // Create a token by passing payload and a string here it is "secret" which is stored in config
      jwt.sign(
        payload,
        config.get("jwtToken"),
        { expiresIn: 3600000 },
        (err, token) => {
          // If there are any errors creating token throw err
          if (err) throw err;
          else {
            res.json({ token });
          }
        }
      );

      res.send("User Registered");
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
