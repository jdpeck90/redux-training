const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//Load User Model
const User = require('../../models/User');


// @route   GET api/users/test
// @desc    Test users route
// @access  Public

router.get('/test', (req, res) => res.json({ msg: "Users Works!" }));


// @route   GET api/users/register
// @desc    Register Users
// @access  Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);


  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { name, email, password } = req.body;
  User.findOne({ email })
    .then(user => {
      if (user) {
        return res.status(400).json({ email: 'Email Alread Exists' })
      } else {
        const avatar = gravatar.url(email, {
          s: '200', //Size
          r: 'pg',  //Rating
          d: 'mm'   //Default
        })

        const newUser = new User({
          name,
          email,
          avatar,
          password
        })

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          })
        })
      }
    })
})

router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors)
  }

  const email = req.body.email;
  const password = req.body.password;


  User.findOne({ email })
    .then(user => {
      if (!user) {
        errors.email = 'User'
        return res.status(404).json({ email: 'User not found' })
      }
      // Check Password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User Matched
          const payload = { id: user.id, name: user.name, avatar: user.avatar } // Create JWT Payload
          // Sign Token
          jwt.sign(payload,
            keys.secretKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token
              })
            })
        } else {
          errors.password = 'Password incorrect'
          return res.status(404).json(errors)
        }
      })
    })
})

// @route     GET api/users/current
// @desc      Return current User
// @access    Private


router.get('/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({ msg: 'Success' });
  }
)
module.exports = router;