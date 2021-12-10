const mongoose = require("mongoose");

// Create a Profile Schema
const ProfileSchema = new mongoose.Schema({
  // To link with the user model so that a user can have a profile
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  //   Company they working
  company: {
    type: String,
  },
  //   Their Website if any
  website: {
    type: String,
  },
  //   Their Location
  location: {
    type: String,
  },
  //   Status : Senior Dev,Teacher,Instructor,etc
  status: {
    type: String,
    required: true,
  },
  //   Skills
  skills: {
    type: [String],
    required: true,
  },
  //   Bio
  bio: {
    type: String,
  },
  //   Github Username
  githubusername: {
    type: String,
  },
  //   Their Experience
  experience: [
    {
      title: {
        type: String,
        required: true,
      },
      company: {
        type: String,
        requried: true,
      },
      location: {
        type: String,
      },
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],
  //   Their Education
  education: [
    {
      school: {
        type: String,
        required: true,
      },
      degree: {
        type: String,
        required: true,
      },
      fieldofstudy: {
        type: String,
        required: true,
      },
      from: {
        type: Date,
        required: true,
      },
      to: {
        type: Date,
      },
      current: {
        type: Boolean,
        default: false,
      },
      description: {
        type: String,
      },
    },
  ],
  //   Social Media Links
  social: {
    youTube: {
      type: String,
    },
    twitter: {
      type: String,
    },
    facebook: {
      type: String,
    },
    linkedIN: {
      type: String,
    },
    instagram: {
      type: String,
    },
  },
  //   Date as of now
  date: {
    type: Date,
    default: Date.now,
  },
});

// Exporting the schema as a model
module.exports = Profile = mongoose.model("profile", ProfileSchema);
