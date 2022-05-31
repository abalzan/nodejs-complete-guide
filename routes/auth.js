const express = require('express');
const { check } = require('express-validator');

const authController = require('../controllers/auth');
const User = require("../models/user");

const router = express.Router();

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.post('/login',[
    check('email')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .custom((value, { req }) => {
            // if the user is already logged in, don't let them sign in again
            if (req.session.isLoggedIn) {
                return Promise.reject('You are already logged in!');
            }
            // if the user is not logged in, check if the email is already in the database
            return User.findOne({email: value}).then((user) => {
                if (!user) {
                    return Promise.reject('Invalid email or password.');
                }
            })
        }).normalizeEmail(),
    check('password', 'Your password, must be at least 6 characters long.').isLength({ min: 6 }).trim(),
], authController.postLogin);
router.post('/logout', authController.postLogout);
router.post('/signup',
    check('email').isEmail().withMessage('Please enter a valid email')
        .custom((value) => {
            return User.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject('Email address already exists');
                }
            });
        }).normalizeEmail(),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').trim(),
    check('confirmPassword').trim().custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
    authController.postSignup);

router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);
module.exports = router;