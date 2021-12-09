const express = require("express");
// Getting the express router
const router = express.Router();

// @route GET api/profile
// @description TEST Route
// @access Public
router.get("/", (req, res) => {
  res.send("Profile Route");
});

module.exports = router;
