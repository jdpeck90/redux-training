const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Validation
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

// Load Profile Model
const Profile = require('../../models/Profile');
// Load User Model
const User = require('../../models/User');

// @route   GET api/profile/test
// @desc    Test profile route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: "Profile Works!" }))

// @route   GET api/profile/
// @desc    Test profile route
// @access  Private
router.get('/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          return res.status(404).json(errors);
        }
        res.json(profile);
      }).catch(err => res.status(404).json(err))
  }
);

// @route   GET api/profile/all
// @desc    GET all profiles
// @access  Public
router.get('/all', (req, res) => {
  const errors = {};

  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = 'There are no profiles';
        return res.status(404).json(errors)
      }

      res.json(profiles)
    })
    .catch(err =>
      res.status(404).json({ profile: 'There are no profiles' })
    )
})



// @route   GET api/profile/handle/:handle
// @desc    GET profile by handle
// @access  Public

router.get('/handle/:handle', (req, res) => {
  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }
    }).catch(err => res.status(404).json(err))

  res.json(profile)
});


// @route   GET api/profile/user/:user_id
// @desc    GET profile by User ID
// @access  Public

router.get('/user/:user_id', (req, res) => {
  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.noprofile = 'There is no profile for this user';
        res.status(404).json(errors);
      }
    }).catch(err => res.status(404).json({ profile: 'There is no profile for this user' }))

  res.json(profile)
});

// @route   POST api/profile 
// @desc    Create or edit user profiles
// @access  Private


router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // Get Fields
    const profileFields = {};
    profileFields.user = req.user.id;

    if (req.body.handle) profileFields.handle = request.body.handle
    if (req.body.company) profileFields.company = request.body.company
    if (req.body.website) profileFields.website = request.body.website
    if (req.body.location) profileFields.location = request.body.location
    if (req.body.bio) profileFields.bio = request.body.bio
    if (req.body.status) profileFields.status = request.body.status
    if (req.body.githubusername) profileFields.githubusername = request.body.githubusername

    //Skills - Split into Array
    if (typeof req.body.skills !== 'undefined') {
      profileFields.skills = req.body.skills.split(',');
    }
    //Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (profile) {
          // Update
          Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true }
          ).then(profile => res.json(profile));
        } else {
          // Create

          // Check if handle exists
          Profile.findOne({ handle: profileFields.handle }).then(profile => {
            if (profile) {
              errors.handle = 'That handle already exists';
              return res.status(404).json(errors);
            }
            //Save Profile
            new Profile(profileFields).save().then(profile => res.json(profile))
          })
        }
      })
  }
);

// @route   POST api/profile/experience
// @desc    Add Experience to Profile
// @access  Private
router.post('/education', passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body)

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const newExp = {
          title: req.body.title,
          company: req.body.company,
          location: req.body.location,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description
        }

        profile.experience.unshift(newExp);

        profile.save().then(profile => res.json(profile))
      })
  })

// @route   DELETE api/profile/experience
// @desc    Add Education to Profile
// @access  Private
router.delete(
  '/experience/:exp_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id)

        //Splice out of array
        profile.experience.splice(removeIndex, 1);

        // Save
        profile.save().then(profile => res.json(profile))
      })
  })

// @route   DELETE api/profile/education
// @desc    Delete Education  
// @access  Private
router.delete(
  '/education/:edu_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {

    Profile.findOneAndRemove({ user: req.user.id })
      .then(profile => {
        User.findOneAndRemove({ user: req.user.id })
          .then(() =>
            res.json({ success: true })
          )
      })
  })

// @route   DELETE api/profile
// @desc    Delete User & Profile
// @access  Private

module.exports = router;