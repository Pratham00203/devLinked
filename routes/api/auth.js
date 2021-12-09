const express = require("express");
// Getting the express router
const router = express.Router();
//Get the authorization middleware
const auth = require("../../middleware/auth");
// Get the User model
const User = require("../../models/User");
// Require the express validator which returns a object of two function and is stored in two functions check,validationResult
const { check, validationResult } = require("express-validator");
// Require bcryptjs
const bcrypt = require("bcryptjs");
// Require JSONwebtoken
const jwt = require("jsonwebtoken");
const config = require("config");

// @route GET api/auth
// @description TEST Route
// @access Public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status.json({ msg: "Server Error" });
  }
});

// @route POST api/auth
// @description Authenticate User and get token
// @access Public
router.post(
  "/",
  [
    // Validation of the fields:
    check("email", "Include valid Email").isEmail(),
    // Error if password is not minimum of 6 characters
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    // Errors array
    const errors = validationResult(req);
    // If the errors array is not empty set status 400:Bad request and give the error messages in json
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get the details of the user
    const { email, password } = req.body;

    try {
      // See if the User Exists:
      // Check if the user exists by email by using findOne
      let user = await User.findOne({ email });
      // If user exists then give the errors array a new message that user exists
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }
      // Verfiy the password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

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
            console.log(token);
            // res.json({ token });
          }
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
