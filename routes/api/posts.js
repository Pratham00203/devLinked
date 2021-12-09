const express = require("express");
// Getting the express router
const router = express.Router();

// @route GET api/posts
// @description TEST Route
// @access Public
router.get("/", (req, res) => {
  res.send("Posts Route");
});

module.exports = router;
